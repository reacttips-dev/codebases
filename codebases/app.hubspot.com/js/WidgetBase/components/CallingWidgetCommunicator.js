'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useRef, useEffect, useContext } from 'react';
import { NavMarker } from 'react-rhumb';
import { useSelector, useDispatch } from 'react-redux';
import { getMetadata, getShouldValidateNumber } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
import { OnboardingStatusPropType } from 'calling-lifecycle-internal/onboarding/operators/OnboardingStatusPropType';
import ClientStatusPropType from 'calling-internal-common/widget-status/prop-types/ClientStatusPropType';
import WidgetBodyContainer from '../../WidgetBody/containers/WidgetBodyContainer';
import CallWidgetFooterContainer from '../../widget-footer/containers/CallWidgetFooterContainer';
import styled from 'styled-components';
import OnboardingContainer from '../../onboarding/containers/OnboardingContainer';
import { getIsCallingNumberNotRegistered } from 'calling-lifecycle-internal/onboarding/operators/getOnboardingStatuses';
import { getIsTwilioBasedCallProvider } from 'calling-lifecycle-internal/call-provider/operators/getIsTwilioBasedCallProvider';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { getSelectedPhoneNumberValueFromState, getSelectedToNumberFromState, getToNumberIdentifierFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { validatePhoneNumberIfNeeded } from '../../validated-numbers/actions/validatedNumbersActions';
import { getIsUsingTwilioConnectFromState } from '../../calling-providers/selectors/getCallingProviders';
import CallExtensionsContext from '../context/CallingExtensionsContext';
import WidgetAlertsContainer from '../../widget-header/containers/WidgetAlertsContainer';
import WidgetHeader from '../../widget-header/components/WidgetHeader';
var OverflowWrapper = styled.div.withConfig({
  displayName: "CallingWidgetCommunicator__OverflowWrapper",
  componentId: "sc-1a88ok3-0"
})(["position:relative;height:100vh;"]);

function CallingWidgetCommunicator(_ref) {
  var clientStatus = _ref.clientStatus,
      onboardingStatus = _ref.onboardingStatus,
      selectedCallProvider = _ref.selectedCallProvider;
  var dispatchRef = useRef(null);
  var dispatch = useDispatch();
  var callExtensions = useContext(CallExtensionsContext);
  dispatchRef.current = dispatch;
  var isTwilioBasedCallProvider = getIsTwilioBasedCallProvider(selectedCallProvider);
  var toNumberIdentifier = useSelector(getToNumberIdentifierFromState);
  var selectedToNumberString = useSelector(getSelectedPhoneNumberValueFromState);
  var isUsingTwilioConnect = useSelector(getIsUsingTwilioConnectFromState);
  var selectedToNumber = useSelector(getSelectedToNumberFromState);
  useEffect(function () {
    if (toNumberIdentifier && selectedToNumberString) {
      var toNumberMetadata = getMetadata(selectedToNumber);
      var shouldValidate = getShouldValidateNumber(toNumberMetadata);

      if (!shouldValidate) {
        return;
      }

      dispatchRef.current(validatePhoneNumberIfNeeded({
        phoneNumberString: selectedToNumberString,
        isUsingConnectAccount: isUsingTwilioConnect,
        phoneNumberIdentifier: toNumberIdentifier
      }));
    }
  }, [toNumberIdentifier, selectedToNumberString, isUsingTwilioConnect, selectedToNumber]);
  return /*#__PURE__*/_jsx(OverflowWrapper, {
    className: "call-widget-main flex-column width-100",
    onboarding: getIsCallingNumberNotRegistered(onboardingStatus),
    isTwilioBasedCallProvider: isTwilioBasedCallProvider,
    children: /*#__PURE__*/_jsxs(OnboardingContainer, {
      callExtensions: callExtensions,
      children: [/*#__PURE__*/_jsx(NavMarker, {
        name: "CALLING_WIDGET_LOADED"
      }), /*#__PURE__*/_jsx(WidgetAlertsContainer, {
        clientStatus: clientStatus,
        isTwilioBasedCallProvider: isTwilioBasedCallProvider
      }), /*#__PURE__*/_jsx(WidgetHeader, {
        clientStatus: clientStatus,
        isTwilioBasedCallProvider: isTwilioBasedCallProvider
      }), /*#__PURE__*/_jsx(WidgetBodyContainer, {
        clientStatus: clientStatus
      }), /*#__PURE__*/_jsx(CallWidgetFooterContainer, {
        clientStatus: clientStatus
      })]
    })
  });
}

CallingWidgetCommunicator.propTypes = {
  clientStatus: ClientStatusPropType.isRequired,
  onboardingStatus: OnboardingStatusPropType.isRequired,
  selectedCallProvider: RecordPropType('CallingProvider').isRequired
};
export default /*#__PURE__*/memo(CallingWidgetCommunicator);