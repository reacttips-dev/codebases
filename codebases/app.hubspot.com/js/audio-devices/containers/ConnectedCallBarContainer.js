'use es6';

import { connect } from 'react-redux';
import ConnectedCallBar from '../components/ConnectedCallBar';
import { getSelectedCallMethodFromState } from '../../active-call-settings/selectors/getActiveCallSettings';

var mapStateToProps = function mapStateToProps(state) {
  return {
    selectedCallMethod: getSelectedCallMethodFromState(state)
  };
};

export default connect(mapStateToProps)(ConnectedCallBar);