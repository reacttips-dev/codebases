'use es6';

import { createSelector } from 'reselect';
import { DISABLED } from 'sales-modal/constants/EnrollHealthStatusTypes';

var getEnrollHealthStatus = function getEnrollHealthStatus(state) {
  return state.enrollHealthStatus;
};

var enrollmentsDisabled = function enrollmentsDisabled(data) {
  return !!(data && data.get('status') === DISABLED);
};

export var shouldDisableEnrollments = createSelector([getEnrollHealthStatus], function (_ref) {
  var data = _ref.data,
      fetching = _ref.fetching;
  return !fetching && enrollmentsDisabled(data);
});