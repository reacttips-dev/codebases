'use es6';

import { createSelector } from 'reselect';

var getSuspensionState = function getSuspensionState(state) {
  return state.suspension;
};

export var getIsPortalSuspended = createSelector([getSuspensionState], function (suspension) {
  return suspension.get('suspended');
});
export var getCanAppeal = createSelector([getSuspensionState], function (suspension) {
  return suspension.get('canAppeal');
});
export var getAppealState = createSelector([getSuspensionState], function (suspension) {
  return suspension.get('appealState');
});
export var getSuspensionFetchStatus = createSelector([getSuspensionState], function (suspension) {
  return suspension.get('fetchStatus');
});