'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useMemo, useCallback, useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { getIsTwilioBasedCallProvider } from 'calling-lifecycle-internal/call-provider/operators/getIsTwilioBasedCallProvider';
import { getHubSpotCallingProvider } from 'calling-lifecycle-internal/call-provider/operators/callProviderOperators';
import { getPersistedCallProvider } from 'calling-lifecycle-internal/utils/getLocalCallSettings';
import get from 'transmute/get';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UISelect from 'UIComponents/input/UISelect';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UILink from 'UIComponents/link/UILink';
import { createSelectedCallProviderMessage } from 'calling-internal-common/iframe-events/internalEventMessageCreators';
import { isSucceeded } from 'conversations-async-data/async-data/operators/statusComparators';
import { getData } from 'conversations-async-data/async-data/operators/getters';
import CallExtensionsContext from '../../WidgetBase/context/CallingExtensionsContext';
import { HUBSPOT } from 'calling-lifecycle-internal/call-provider/constants/ProviderNames';
import { AIRCALL } from 'calling-extensions-sdk-support/external-provider/constants/StaticExternalProviderNames';
import { getProviderSupportsCurrentObjectType } from '../../calling-providers/operators/getProviderSupportsCurrentObjectType';
import { NO_ACCOUNT } from 'calling-lifecycle-internal/onboarding/constants/onboardingStatuses';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';
import { callingActivitiesSettingsUrl } from 'calling-settings-ui-library/utils/urlUtils';

function CallProviderDropdown(_ref) {
  var setSelectedProvider = _ref.setSelectedProvider,
      selectedCallProvider = _ref.selectedCallProvider,
      callProviders = _ref.callProviders,
      isCallingExtensionsEnabled = _ref.isCallingExtensionsEnabled,
      objectTypeId = _ref.objectTypeId,
      hasCallingProvidersCapability = _ref.hasCallingProvidersCapability,
      initialLoadSettings = _ref.initialLoadSettings,
      hubSpotCallingEnabled = _ref.hubSpotCallingEnabled,
      portalId = _ref.portalId;
  var verifiedInitialSelectedCallProvider = useRef(false);
  var callExtensions = useContext(CallExtensionsContext);
  var callingProvidersList = getData(callProviders);
  var setProvider = useCallback(function (provider) {
    setSelectedProvider(provider);
    var message = createSelectedCallProviderMessage(provider.toJS());
    callExtensions.postMessageToHost(message);
  }, [callExtensions, setSelectedProvider]);
  useEffect(function () {
    var name = selectedCallProvider && get('name', selectedCallProvider);

    if (!isCallingExtensionsEnabled && name !== AIRCALL && !getIsTwilioBasedCallProvider(selectedCallProvider)) {
      setProvider(getHubSpotCallingProvider());
    }
  }, [callExtensions, isCallingExtensionsEnabled, selectedCallProvider, setProvider, setSelectedProvider]);
  useEffect(function () {
    if (isSucceeded(callProviders) && !verifiedInitialSelectedCallProvider.current) {
      var initialSelectedProvider = getPersistedCallProvider();
      var containsCurrentProvider = !!callingProvidersList.find(function (provider) {
        return get('name', provider) === get('name', initialSelectedProvider);
      }); // Prioritize hubspot calling

      var providerToSelect = getHubSpotCallingProvider();

      if (initialLoadSettings.token.tokenType === NO_ACCOUNT) {
        providerToSelect = callingProvidersList.first();
      }

      if (!containsCurrentProvider) {
        setProvider(providerToSelect);
      }

      verifiedInitialSelectedCallProvider.current = true;
    }
  }, [callExtensions, callProviders, callingProvidersList, setProvider, setSelectedProvider, initialLoadSettings.token.tokenType]);
  var hubSpotCallingDisabledText = useMemo(function () {
    return /*#__PURE__*/_jsx(FormattedJSXMessage, {
      message: "calling-communicator-ui.settings.disabledHubSpotCalling_jsx",
      options: {
        href: callingActivitiesSettingsUrl(portalId),
        external: true
      },
      elements: {
        UILink: UILink
      }
    });
  }, [portalId]);
  var selectOptions = useMemo(function () {
    return callingProvidersList.reduce(function (acc, callingProvider) {
      if (callingProvider) {
        var name = get('name', callingProvider);
        var isTwilioBasedCallProvider = getIsTwilioBasedCallProvider(callingProvider);
        var isProviderDisabled = !isTwilioBasedCallProvider && name !== AIRCALL && !isCallingExtensionsEnabled;

        if (!isProviderDisabled) {
          isProviderDisabled = !getProviderSupportsCurrentObjectType({
            objectTypeId: objectTypeId,
            selectedCallProvider: callingProvider
          });
        }

        var disabledText;
        var isCallProviderCapabilityDisabled = !hasCallingProvidersCapability && !isTwilioBasedCallProvider;
        var isHubSpotCallingDisabled = !hubSpotCallingEnabled && name === HUBSPOT;

        if (isProviderDisabled && isCallingExtensionsEnabled) {
          disabledText = /*#__PURE__*/_jsx(FormattedMessage, {
            message: "calling-communicator-ui.thirdPartyCustomObjectAlert.info"
          });
        } else if (isCallProviderCapabilityDisabled) {
          disabledText = /*#__PURE__*/_jsx(FormattedMessage, {
            message: "calling-communicator-ui.settings.doesntHaveCallingProvidersCapability"
          });
        } else if (isHubSpotCallingDisabled) {
          disabledText = hubSpotCallingDisabledText;
        } else {
          disabledText = /*#__PURE__*/_jsx(FormattedMessage, {
            message: "calling-communicator-ui.settings.disabledProvider"
          });
        }

        acc.push({
          text: name,
          value: name,
          disabled: isProviderDisabled || isCallProviderCapabilityDisabled || isHubSpotCallingDisabled,
          disabledText: disabledText
        });
      }

      return acc;
    }, []);
  }, [callingProvidersList, isCallingExtensionsEnabled, objectTypeId, hasCallingProvidersCapability, hubSpotCallingEnabled, hubSpotCallingDisabledText]);
  var hasHubSpotCallingDisabledAndNoThirdParties = useMemo(function () {
    if (!isSucceeded(callProviders)) return false;
    return !hubSpotCallingEnabled && callingProvidersList.size <= 1;
  }, [callProviders, callingProvidersList, hubSpotCallingEnabled]);
  var handleUpdateCallProvider = useCallback(function (_ref2) {
    var value = _ref2.target.value;
    CommunicatorLogger.log('communicator_ProviderSwitch', {
      action: 'provider switch',
      activity: 'call',
      channel: 'outbound call',
      switchFrom: selectedCallProvider.get('name'),
      switchTo: value
    });
    var selectedProvider = callingProvidersList.find(function (provider) {
      return get('name', provider) === value;
    });
    setProvider(selectedProvider);
    return selectedProvider;
  }, [selectedCallProvider, callingProvidersList, setProvider]);

  if (!isSucceeded(callProviders) || callingProvidersList.size <= 1 && !hasHubSpotCallingDisabledAndNoThirdParties) {
    return null;
  }

  var CustomItem = function CustomItem(_ref3) {
    var children = _ref3.children,
        option = _ref3.option,
        disableTooltip = _ref3.disableTooltip,
        rest = _objectWithoutProperties(_ref3, ["children", "option", "disableTooltip"]);

    return /*#__PURE__*/_jsx("span", Object.assign({}, rest, {
      children: /*#__PURE__*/_jsx(UITooltip, {
        placement: "right",
        title: option.disabledText,
        disabled: !option.disabled || disableTooltip,
        children: children
      })
    }));
  };

  return /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsx(FormattedMessage, {
      message: "calling-communicator-ui.settings.callingProvider"
    }), /*#__PURE__*/_jsx(UITooltip, {
      placement: "top",
      disabled: !hasHubSpotCallingDisabledAndNoThirdParties,
      title: hubSpotCallingDisabledText,
      children: /*#__PURE__*/_jsx(UISelect, {
        "data-selenium-test": "calling-widget-call-provider-dropdown",
        itemComponent: CustomItem,
        onChange: handleUpdateCallProvider,
        options: selectOptions,
        value: get('name', selectedCallProvider),
        className: "p-all-1 non-responsive-dropdown",
        buttonUse: "transparent",
        style: {
          width: 'auto'
        },
        responsive: false,
        searchable: false,
        disabled: hasHubSpotCallingDisabledAndNoThirdParties
      })
    })]
  });
}

CallProviderDropdown.propTypes = {
  setSelectedProvider: PropTypes.func.isRequired,
  selectedCallProvider: RecordPropType('CallingProvider').isRequired,
  callProviders: RecordPropType('AsyncData').isRequired,
  isCallingExtensionsEnabled: PropTypes.bool.isRequired,
  objectTypeId: PropTypes.string.isRequired,
  hasCallingProvidersCapability: PropTypes.bool.isRequired,
  initialLoadSettings: RecordPropType('InitialLoadSettings').isRequired,
  hubSpotCallingEnabled: PropTypes.bool.isRequired,
  portalId: PropTypes.number.isRequired
};
export default /*#__PURE__*/memo(CallProviderDropdown);