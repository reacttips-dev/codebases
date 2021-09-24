'use es6';

import { connect } from 'react-redux';
import SearchableCalleeList from 'calling-ui-library/callee-select/components/SearchableCalleeList';
import { editPermissionsResultsFromState } from '../../permissions/selectors/getPermissions';

var mapStateToProps = function mapStateToProps(state, props) {
  return {
    editPermissionsResults: editPermissionsResultsFromState(state, props)
  };
};

export default connect(mapStateToProps)(SearchableCalleeList);