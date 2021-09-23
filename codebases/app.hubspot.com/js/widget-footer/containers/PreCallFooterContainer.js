'use es6';

import { connect } from 'react-redux';
import PreCallFooter from '../components/PreCallFooter';
import { getSelectedCallProviderFromState, getCallProvidersAsyncDataFromState, hasNecessaryScopesForCallingExtension } from '../../calling-providers/selectors/getCallingProviders';
import { getObjectTypeIdFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { getOnboardingStatusFromState } from '../../onboarding/selectors/getOnboardingStatusFromState';
import { getIsMicrophoneAccessLoadingFromState } from '../../microphone-access/selectors/getMicrophonePermissions';
import { shouldShowGDPRMessage } from '../../gdpr/selectors/bypassGDPR';
import { getHubSpotCallingEnabledFromState } from '../../calling-admin-settings/selectors/getCallingAdminSettingsFromState';

var mapStateToProps = function mapStateToProps(state) {
  return {
    shouldShowGDPRMessage: shouldShowGDPRMessage(state),
    callProviders: getCallProvidersAsyncDataFromState(state),
    selectedCallProvider: getSelectedCallProviderFromState(state),
    isCallingExtensionsEnabled: hasNecessaryScopesForCallingExtension(state),
    onboardingStatus: getOnboardingStatusFromState(state),
    isMicrophoneAccessLoading: getIsMicrophoneAccessLoadingFromState(state),
    objectTypeId: getObjectTypeIdFromState(state),
    hubSpotCallingEnabled: getHubSpotCallingEnabledFromState(state)
  };
};

var mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(PreCallFooter);