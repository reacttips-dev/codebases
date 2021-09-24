'use es6';

import { connect } from 'react-redux';
import { getOnboardingStatusFromState, getRegisterFromNumberTypeFromState, getShouldShowOnboardingIntroFromState } from '../selectors/getOnboardingStatusFromState';
import Onboarding from '../components/Onboarding';
import { getClientStatusFromState, getSubjectIdFromState, getObjectTypeIdFromState, getAppIdentifierFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { getIsUsingTwilioConnectFromState, getIsTwilioBasedCallProviderFromState } from '../../calling-providers/selectors/getCallingProviders';
import { resetHubSpotRegistration } from '../../register-number/actions/RegisterNumberInverseActions';
import { resetTwilioConnectRegistration } from '../../register-number/actions/TwilioConnectActions';
import { resetOnboardingState, setRegisterFromNumberType, setShouldShowOnboardingIntro } from '../actions/actions';
import { getIsPaidHubFromState, getIsSalesEnterpriseTrialFromState } from '../../settings-omnibus/selectors/getPortalSettingsFromState';
import { getScopesFromState, getUserEmailFromState, getUserIdFromState, isUngatedFor } from '../../Auth/selectors/authSelectors';
import { getInitialLoadSettingsFromState } from 'calling-communicator-ui/initial-load-settings/selectors/getInitialLoadSettings';
import { getOmnibusSettings } from '../../settings-omnibus/actions/settingsOmnibusActions';
import { CALLING_COUNTRY_UNSUPPORTED_MESSAGING } from 'calling-lifecycle-internal/constants/CallingGates';
import { getHubSpotCallingEnabledFromState, getIsUngatedForPhoneNumberAcquisition } from '../../calling-admin-settings/selectors/getCallingAdminSettingsFromState';

var mapStateToProps = function mapStateToProps(state) {
  return {
    onboardingStatus: getOnboardingStatusFromState(state),
    clientStatus: getClientStatusFromState(state),
    isUsingTwilioConnect: getIsUsingTwilioConnectFromState(state),
    isThirdPartyProvider: !getIsTwilioBasedCallProviderFromState(state),
    shouldShowOnboardingIntro: getShouldShowOnboardingIntroFromState(state),
    registerFromNumberType: getRegisterFromNumberTypeFromState(state),
    isPaidHub: getIsPaidHubFromState(state),
    isSalesEnterpriseTrial: getIsSalesEnterpriseTrialFromState(state),
    scopes: getScopesFromState(state).toJS(),
    userEmail: getUserEmailFromState(state),
    userId: getUserIdFromState(state),
    initialLoadSettings: getInitialLoadSettingsFromState(state),
    subjectId: getSubjectIdFromState(state),
    objectTypeId: getObjectTypeIdFromState(state),
    isUngatedForCountryUnsupportedMessaging: isUngatedFor(state, {
      gate: CALLING_COUNTRY_UNSUPPORTED_MESSAGING
    }),
    appIdentifier: getAppIdentifierFromState(state),
    hubSpotCallingEnabled: getHubSpotCallingEnabledFromState(state),
    isUngatedForPhoneNumberAcquisition: getIsUngatedForPhoneNumberAcquisition(state)
  };
};

var mapDispatchToProps = {
  resetTwilioConnectRegistration: resetTwilioConnectRegistration,
  resetHubSpotRegistration: resetHubSpotRegistration,
  setShouldShowOnboardingIntro: setShouldShowOnboardingIntro,
  resetOnboardingState: resetOnboardingState,
  setRegisterFromNumberType: setRegisterFromNumberType,
  getOmnibusSettings: getOmnibusSettings
};
export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);