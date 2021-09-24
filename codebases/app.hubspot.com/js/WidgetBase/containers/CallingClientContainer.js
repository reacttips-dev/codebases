'use es6';

import { connect } from 'react-redux';
import { getTwilioTokenFromState, getRecordingEnabledFromState } from '../../settings-omnibus/selectors/getInitialLoadSettings';
import { getActiveCallSettingsFromState, getSelectedCallMethodFromState, getSelectedFromNumberFromState, getInvalidPhoneNumberMessageFromState, getAppIdentifierFromState, getClientStatusFromState, getToNumberIdentifierFromState, getSelectedToNumberFromState, getValidatedToNumberFromState, getSelectedCallableObjectFromState, getSubjectIdFromState, getObjectTypeIdFromState, getThreadIdFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { getIsUsingTwilioConnectFromState, getSelectedCallProviderFromState } from '../../calling-providers/selectors/getCallingProviders';
import CallingClient from '../components/CallingClient';
import { setClientStatus, setEndCallData, setToNumberIdentifier, setSubject } from '../../active-call-settings/actions/activeCallSettingsActions';
import { fetchCallees, fetchCalleeIfNeeded, clearCalleesSearch, clearCallees } from '../../callees/actions/calleesActions';
import { setAvailableInputDevices, setAvailableOutputDevices, setInputDevice, setOutputDevice, setOutputDeviceNotSupported, setInputDeviceNotSupported } from '../../audio-devices/actions/audioDeviceActions';
import { setMosScore } from '../../network-quality/actions/networkQualityActions';
import { setDeviceError } from '../../device-errors/actions/deviceErrorActions';
import { getUserIdFromState, getPortalIdFromState, isUngatedFor } from '../../Auth/selectors/authSelectors';
import { getMinutesUsage } from '../../minutes-alert-banner/actions/minutesUsageActions';
import { getEngagementFromState } from '../../engagement/selectors/getEngagement';
import { setEngagementData } from '../../engagement/actions/engagementActions';
import { getHasMicrophoneAccessFromState } from '../../microphone-access/selectors/getMicrophonePermissions';
import { getMicrophoneAccess } from '../../microphone-access/actions/microphoneAccessActions';
import { getOnboardingStatusFromState } from '../../onboarding/selectors/getOnboardingStatusFromState';
import { resetCallData, setIsQueueTask } from '../../active-call-settings/actions/activeCallSettingsActions';
import { getThirdPartyCallingStatus } from '../../third-party-calling/selectors/thirdPartyCallingSelectors';
import { getBypassGDPRFromState } from '../../gdpr/selectors/bypassGDPR';
import { setInitialRecordState } from '../../record/actions/recordActions';
import { shouldShowGDPRMessage } from '../../gdpr/selectors/bypassGDPR';
import { getCalleesDataFromState } from 'calling-communicator-ui/callees/selectors/calleesSelectors';
import { setCallSid } from '../../record/actions/recordActions';

var mapStateToProps = function mapStateToProps(state) {
  var CALL_FROM_PHONE_OMNIBUS = 'Calling:UseCallMyPhoneOmnibus';
  return {
    isUngatedForCallMyPhoneOmnibus: isUngatedFor(state, {
      gate: CALL_FROM_PHONE_OMNIBUS
    }),
    appIdentifier: getAppIdentifierFromState(state),
    activeCallSettings: getActiveCallSettingsFromState(state),
    callees: getCalleesDataFromState(state),
    engagement: getEngagementFromState(state),
    selectedCallMethod: getSelectedCallMethodFromState(state),
    selectedCallProvider: getSelectedCallProviderFromState(state),
    userId: getUserIdFromState(state),
    portalId: getPortalIdFromState(state),
    twilioToken: getTwilioTokenFromState(state),
    isUsingTwilioConnect: getIsUsingTwilioConnectFromState(state),
    toNumberIdentifier: getToNumberIdentifierFromState(state),
    selectedToNumber: getSelectedToNumberFromState(state),
    clientStatus: getClientStatusFromState(state),
    thirdPartyStatus: getThirdPartyCallingStatus(state),
    hasMicrophonePermissions: getHasMicrophoneAccessFromState(state),
    recordingEnabled: getRecordingEnabledFromState(state),
    selectedFromNumber: getSelectedFromNumberFromState(state),
    onboardingStatus: getOnboardingStatusFromState(state),
    isGDPRBypassed: getBypassGDPRFromState(state),
    validationErrorMessage: getInvalidPhoneNumberMessageFromState(state),
    shouldShowGDPRMessage: shouldShowGDPRMessage(state),
    validatedToNumber: getValidatedToNumberFromState(state),
    selectedCallableObject: getSelectedCallableObjectFromState(state),
    subjectId: getSubjectIdFromState(state),
    objectTypeId: getObjectTypeIdFromState(state),
    threadId: getThreadIdFromState(state)
  };
};

var mapDispatchToProps = {
  fetchCallees: fetchCallees,
  fetchCalleeIfNeeded: fetchCalleeIfNeeded,
  setClientStatus: setClientStatus,
  setEngagementData: setEngagementData,
  setCallSid: setCallSid,
  setEndCallData: setEndCallData,
  setAvailableInputDevices: setAvailableInputDevices,
  setAvailableOutputDevices: setAvailableOutputDevices,
  setOutputDeviceNotSupported: setOutputDeviceNotSupported,
  setInputDeviceNotSupported: setInputDeviceNotSupported,
  setInputDevice: setInputDevice,
  setOutputDevice: setOutputDevice,
  setMosScore: setMosScore,
  setDeviceError: setDeviceError,
  getMicrophoneAccess: getMicrophoneAccess,
  getMinutesUsage: getMinutesUsage,
  setToNumberIdentifier: setToNumberIdentifier,
  resetCallData: resetCallData,
  setInitialRecordState: setInitialRecordState,
  setSubject: setSubject,
  clearCalleesSearch: clearCalleesSearch,
  clearCallees: clearCallees,
  setIsQueueTask: setIsQueueTask
};
export default connect(mapStateToProps, mapDispatchToProps)(CallingClient);