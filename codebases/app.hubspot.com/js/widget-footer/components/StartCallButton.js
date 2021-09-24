'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useContext, memo, useCallback, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'transmute/get';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { isSucceeded, isLoading } from 'conversations-async-data/async-data/operators/statusComparators';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import { getMetadata, getShouldValidateNumber } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
import { getIsTwilioBasedCallProvider, getIsProviderHubSpot } from 'calling-lifecycle-internal/call-provider/operators/getIsTwilioBasedCallProvider';
import { CALL_FROM_PHONE, CALL_FROM_BROWSER } from 'calling-lifecycle-internal/constants/CallMethods';
import CallClientContext from 'calling-client-interface/context/CallClientContext';
import UILink from 'UIComponents/link/UILink';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import { messageConstants } from 'calling-settings-ui-library/number-registration/utils/InvalidPhoneNumberMessage';
import styled from 'styled-components';
var StartCallWrapper = styled.div.withConfig({
  displayName: "StartCallButton__StartCallWrapper",
  componentId: "yartve-0"
})(["display:flex;flex-direction:row;"]);

function StartCallButton(_ref) {
  var callProviderIsReady = _ref.callProviderIsReady,
      className = _ref.className,
      selectedCallProvider = _ref.selectedCallProvider,
      selectedCallMethod = _ref.selectedCallMethod,
      isMicrophoneAccessDenied = _ref.isMicrophoneAccessDenied,
      hasMinutesAvailable = _ref.hasMinutesAvailable,
      selectedToNumber = _ref.selectedToNumber,
      invalidPhoneNumberMessage = _ref.invalidPhoneNumberMessage,
      isLoggedIn = _ref.isLoggedIn,
      validatedToNumber = _ref.validatedToNumber,
      providerSupportsObjectType = _ref.providerSupportsObjectType,
      hubSpotCallingEnabled = _ref.hubSpotCallingEnabled;
  var client = useContext(CallClientContext);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      disabled = _useState2[0],
      setDisabled = _useState2[1];

  var isTwilioBasedCallProvider = getIsTwilioBasedCallProvider(selectedCallProvider);
  var isHubspotProvider = getIsProviderHubSpot(selectedCallProvider);

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isTimeElapsed = _useState4[0],
      setTimeElapsed = _useState4[1];

  useEffect(function () {
    setTimeElapsed(false);
    var handler = setTimeout(function () {
      setTimeElapsed(true);
    }, 10000);
    return function () {
      clearTimeout(handler);
    };
  }, [selectedCallProvider]);
  var handleOnClick = useCallback(function () {
    if (isTwilioBasedCallProvider) {
      setDisabled(isTwilioBasedCallProvider);
    }

    client.initiateStartCall();
  }, [client, isTwilioBasedCallProvider]);
  var handleOnClickForce = useCallback(function () {
    if (isTwilioBasedCallProvider) {
      setDisabled(isTwilioBasedCallProvider);
    }

    client.forceThirdPartyStartCall();
  }, [client, isTwilioBasedCallProvider]);
  var isValidNumber = useMemo(function () {
    if (!selectedToNumber) {
      return false;
    }

    var selectedNumberMeta = selectedToNumber && getMetadata(selectedToNumber);
    var shouldValidateNumber = selectedNumberMeta && getShouldValidateNumber(selectedNumberMeta);
    return Boolean(shouldValidateNumber);
  }, [selectedToNumber]);
  var isDisabled = useMemo(function () {
    var needsMicPermission = isTwilioBasedCallProvider && selectedCallMethod === CALL_FROM_BROWSER && isMicrophoneAccessDenied === true;
    var requiresValidatedNumber = !validatedToNumber || !isSucceeded(validatedToNumber);
    var numberIsInvalid = !selectedToNumber || !!invalidPhoneNumberMessage && invalidPhoneNumberMessage !== messageConstants.CALL_ID_INVALID;
    var hasNoMinutesAvailable = isHubspotProvider && !hasMinutesAvailable;
    var hasHubSpotCallingDisabled = !hubSpotCallingEnabled && isHubspotProvider;
    return disabled || requiresValidatedNumber || needsMicPermission || numberIsInvalid || hasNoMinutesAvailable || hasHubSpotCallingDisabled;
  }, [isTwilioBasedCallProvider, selectedCallMethod, isMicrophoneAccessDenied, validatedToNumber, selectedToNumber, invalidPhoneNumberMessage, isHubspotProvider, hasMinutesAvailable, disabled, hubSpotCallingEnabled]);
  var providerName = get('name', selectedCallProvider);
  var loading = !callProviderIsReady || isValidNumber && isLoading(validatedToNumber) || !validatedToNumber;
  var startButtonText = !loading && !isLoggedIn ? /*#__PURE__*/_jsx(FormattedMessage, {
    message: "calling-communicator-ui.callingButtons.login",
    options: {
      providerName: providerName
    }
  }) : /*#__PURE__*/_jsx(FormattedMessage, {
    message: "calling-communicator-ui.callingButtons.call"
  });

  if (!providerSupportsObjectType) {
    return null;
  }

  return /*#__PURE__*/_jsxs(StartCallWrapper, {
    children: [/*#__PURE__*/_jsxs(UILoadingButton, {
      disabled: isDisabled || loading,
      onClick: handleOnClick,
      size: "small",
      use: "primary",
      resultIcon: null,
      className: "call-button m-x-3 m-top-4 " + className,
      style: {
        minWidth: 100
      },
      loading: loading,
      responsive: false,
      preventClicksOnLoading: true,
      "data-selenium-test": "calling-widget-start-call-button",
      children: [/*#__PURE__*/_jsx(UIIcon, {
        name: "calling"
      }), startButtonText]
    }), !callProviderIsReady && isTimeElapsed ? /*#__PURE__*/_jsx("small", {
      className: "m-top-4 display-inline-block",
      children: /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: "calling-communicator-ui.callingButtons.failedThirdPartyInitializationMsg_jsx",
        options: {
          onClick: handleOnClickForce,
          providername: providerName
        },
        elements: {
          UILink: UILink
        }
      })
    }) : null]
  });
}

StartCallButton.propTypes = {
  callProviderIsReady: PropTypes.bool.isRequired,
  className: PropTypes.string,
  hasMinutesAvailable: PropTypes.bool.isRequired,
  invalidPhoneNumberMessage: PropTypes.string,
  isLoggedIn: PropTypes.bool.isRequired,
  selectedToNumber: RecordPropType('PhoneNumberProperty'),
  selectedCallProvider: RecordPropType('CallingProvider'),
  validatedToNumber: RecordPropType('AsyncData'),
  selectedCallMethod: PropTypes.oneOf([CALL_FROM_PHONE, CALL_FROM_BROWSER]).isRequired,
  isMicrophoneAccessDenied: PropTypes.bool,
  providerSupportsObjectType: PropTypes.bool,
  hubSpotCallingEnabled: PropTypes.bool.isRequired
};
export default /*#__PURE__*/memo(StartCallButton);