'use es6';

import { connect } from 'react-redux';
import { getSelectedCallMethodFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import CallMethodDropdown from '../components/CallMethodDropdown';
import { setSelectedCallMethod } from '../../active-call-settings/actions/activeCallSettingsActions';
import { getOnboardingStatusFromState } from '../../onboarding/selectors/getOnboardingStatusFromState';
import { getMicrophonePermissionsState } from '../../microphone-access/actions/microphonePermissionsActions';
import { getHasMicrophoneAccessFromState } from '../../microphone-access/selectors/getMicrophonePermissions';

var mapStateToProps = function mapStateToProps(state) {
  return {
    selectedCallMethod: getSelectedCallMethodFromState(state),
    onboardingStatus: getOnboardingStatusFromState(state),
    hasMicrophoneAccess: getHasMicrophoneAccessFromState(state)
  };
};

var mapDispatchToProps = {
  setSelectedCallMethod: setSelectedCallMethod,
  getMicrophonePermissionsState: getMicrophonePermissionsState
};
export default connect(mapStateToProps, mapDispatchToProps)(CallMethodDropdown);