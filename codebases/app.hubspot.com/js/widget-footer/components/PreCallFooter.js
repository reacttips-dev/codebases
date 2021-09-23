'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { getIsOnboardingComplete, getIsOnboardingLoading } from 'calling-lifecycle-internal/onboarding/operators/getOnboardingStatuses';
import { getIsTwilioBasedCallProvider } from 'calling-lifecycle-internal/call-provider/operators/getIsTwilioBasedCallProvider';
import { getIsProviderTwilioConnect } from 'calling-lifecycle-internal/call-provider/operators/getIsProviderTwilioConnect';
import PreCallFooterSkeleton from 'calling-lifecycle-internal/skeleton-states/components/PreCallFooterSkeleton';
import WidgetSettingsWrapper from 'calling-lifecycle-internal/skeleton-states/components/WidgetSettingsWrapper';
import { OnboardingStatusPropType } from 'calling-lifecycle-internal/onboarding/operators/OnboardingStatusPropType';
import CallProviderDropdownContainer from '../../calling-providers/containers/CallProviderDropdownContainer';
import FromPhoneNumberDropdownContainer from '../containers/FromPhoneNumberDropdownContainer';
import CallMethodDropdownContainer from '../containers/CallMethodDropdownContainer';
import StartCallButtonContainer from '../containers/StartCallButtonContainer';
import LoadingMicrophoneAccessModal from '../../microphone-access/components/LoadingMIcrophoneAccessModal';
var FooterBottomRowWrapper = styled.div.withConfig({
  displayName: "PreCallFooter__FooterBottomRowWrapper",
  componentId: "af7tia-0"
})(["flex-wrap:wrap;justify-content:space-between;"]);
var StyledWidgetSettingsWrapper = styled(WidgetSettingsWrapper).withConfig({
  displayName: "PreCallFooter__StyledWidgetSettingsWrapper",
  componentId: "af7tia-1"
})(["min-height:51px;"]);

function PreCallFooter(_ref) {
  var isReady = _ref.isReady,
      selectedCallProvider = _ref.selectedCallProvider,
      callProviders = _ref.callProviders,
      onboardingStatus = _ref.onboardingStatus,
      isMicrophoneAccessLoading = _ref.isMicrophoneAccessLoading,
      shouldShowGDPRMessage = _ref.shouldShowGDPRMessage,
      isCallingExtensionsEnabled = _ref.isCallingExtensionsEnabled,
      objectTypeId = _ref.objectTypeId,
      hubSpotCallingEnabled = _ref.hubSpotCallingEnabled;
  var disabled = !isReady;
  var isTwilioBasedCallProvider = getIsTwilioBasedCallProvider(selectedCallProvider);
  var isUsingTwilioConnect = getIsProviderTwilioConnect(selectedCallProvider);
  var showTwilioSettings = isTwilioBasedCallProvider;
  var isOnboardingComplete = getIsOnboardingComplete(onboardingStatus);
  var isOnboardingLoading = getIsOnboardingLoading(onboardingStatus);
  var showHubSpotCallingDisabled = !hubSpotCallingEnabled && !isUsingTwilioConnect;
  return /*#__PURE__*/_jsxs("div", {
    className: "width-100",
    children: [isMicrophoneAccessLoading && /*#__PURE__*/_jsx(LoadingMicrophoneAccessModal, {}), isOnboardingLoading && /*#__PURE__*/_jsx(PreCallFooterSkeleton, {
      className: "m-left-3"
    }), (isOnboardingComplete || showHubSpotCallingDisabled) && !shouldShowGDPRMessage && /*#__PURE__*/_jsx(StartCallButtonContainer, {
      isLoading: !isReady,
      selectedCallProvider: selectedCallProvider,
      hubSpotCallingEnabled: hubSpotCallingEnabled
    }), /*#__PURE__*/_jsxs(StyledWidgetSettingsWrapper, {
      className: "m-top-3 p-y-3 p-x-3",
      children: [objectTypeId && /*#__PURE__*/_jsx(CallProviderDropdownContainer, {
        disabled: disabled,
        selectedCallProvider: selectedCallProvider,
        callProviders: callProviders,
        isCallingExtensionsEnabled: isCallingExtensionsEnabled
      }), /*#__PURE__*/_jsxs(FooterBottomRowWrapper, {
        className: "display-flex",
        children: [showTwilioSettings && /*#__PURE__*/_jsx(FromPhoneNumberDropdownContainer, {
          disabled: disabled,
          selectedCallProvider: selectedCallProvider
        }), showTwilioSettings && !isUsingTwilioConnect && /*#__PURE__*/_jsx("div", {
          className: "display-flex justify-end",
          children: /*#__PURE__*/_jsx(CallMethodDropdownContainer, {
            disabled: disabled
          })
        })]
      })]
    })]
  });
}

PreCallFooter.propTypes = {
  isReady: PropTypes.bool.isRequired,
  isMicrophoneAccessLoading: PropTypes.bool.isRequired,
  onboardingStatus: OnboardingStatusPropType.isRequired,
  selectedCallProvider: RecordPropType('CallingProvider').isRequired,
  callProviders: RecordPropType('AsyncData').isRequired,
  shouldShowGDPRMessage: PropTypes.bool.isRequired,
  isCallingExtensionsEnabled: PropTypes.bool.isRequired,
  objectTypeId: PropTypes.string,
  hubSpotCallingEnabled: PropTypes.bool.isRequired
};
export default /*#__PURE__*/memo(PreCallFooter);