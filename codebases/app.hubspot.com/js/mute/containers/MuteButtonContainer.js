'use es6';

import { connect } from 'react-redux';
import MuteButton from '../components/MuteButton';
import { getSelectedCallMethodFromState, getAppIdentifierFromState } from '../../active-call-settings/selectors/getActiveCallSettings';

var mapStateToProps = function mapStateToProps(state) {
  return {
    selectedCallMethod: getSelectedCallMethodFromState(state),
    appIdentifier: getAppIdentifierFromState(state)
  };
};

export default connect(mapStateToProps)(MuteButton);