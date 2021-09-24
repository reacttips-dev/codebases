'use es6';

import { connect } from 'react-redux';
import { getCalleeProperties } from '../../callee-properties/actions/calleePropertiesActions';
import { getCalleePropertiesFromState } from '../../callee-properties/selectors/getCalleeProperties';
import { getUpdateTypeFromState } from '../../callees/selectors/addingPropertySelectors';
import UpdateCalleeNumbers from '../components/UpdateCalleeNumbers';

var mapStateToProps = function mapStateToProps(state) {
  return {
    updateType: getUpdateTypeFromState(state),
    calleeProperties: getCalleePropertiesFromState(state)
  };
};

var mapDispatchToProps = {
  getCalleeProperties: getCalleeProperties
};
export default connect(mapStateToProps, mapDispatchToProps)(UpdateCalleeNumbers);