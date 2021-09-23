'use es6';

import { connect } from 'react-redux';
import { getIsMicrophoneAccessDeniedFromState } from '../selectors/getMicrophonePermissions';
import NoMicrophoneAccessError from '../components/NoMicrophoneAccessError';
import { getSelectedCallMethodFromState } from '../../active-call-settings/selectors/getActiveCallSettings';

var mapStateToProps = function mapStateToProps(state) {
  return {
    isMicrophoneAccessDenied: getIsMicrophoneAccessDeniedFromState(state),
    selectedCallMethod: getSelectedCallMethodFromState(state)
  };
};

export default connect(mapStateToProps)(NoMicrophoneAccessError);