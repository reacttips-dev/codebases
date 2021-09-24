'use es6';

import { connect } from 'react-redux';
import compose from 'transmute/compose';
import ActivityTypesSelect from '../components/ActivityTypesSelect';
import { getActivityTypesFromState } from '../selectors/getActivityTypes';
import { withActivityTypes } from '../decorators/RequireActivityTypes';
import { setActivityType } from '../../engagement/actions/engagementActions';
import { getAppIdentifierFromState } from '../../active-call-settings/selectors/getActiveCallSettings';

var mapStateToProps = function mapStateToProps(state) {
  return {
    options: getActivityTypesFromState(state),
    appIdentifier: getAppIdentifierFromState(state)
  };
};

var mapDispatchToProps = {
  setActivityType: setActivityType
};
export default compose(connect(mapStateToProps, mapDispatchToProps), withActivityTypes(function (data) {
  return {
    options: data
  };
}))(ActivityTypesSelect);