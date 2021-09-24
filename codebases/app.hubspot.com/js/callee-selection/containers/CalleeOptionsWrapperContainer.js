'use es6';

import { connect } from 'react-redux';
import CalleeOptionsWrapper from '../components/CalleeOptionsWrapper';
import { getCalleeProperties } from '../../callee-properties/actions/calleePropertiesActions';
import { getCalleePropertiesFromState } from '../../callee-properties/selectors/getCalleeProperties';

var mapStateToProps = function mapStateToProps(state) {
  return {
    calleeProperties: getCalleePropertiesFromState(state)
  };
};

var mapDispatchToProps = {
  getCalleeProperties: getCalleeProperties
};
export default connect(mapStateToProps, mapDispatchToProps)(CalleeOptionsWrapper);