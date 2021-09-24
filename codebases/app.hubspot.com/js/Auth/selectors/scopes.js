'use es6';

import { createSelector } from 'reselect';
import { getScopesFromState } from './authSelectors';
export var getIsScopedForBETActivityTypes = createSelector([getScopesFromState], function (scopes) {
  return scopes.includes('bet-engagements-render-activity-type');
});
export var getIsScopedForBETISCActivityDetails = createSelector([getScopesFromState], function (scopes) {
  return scopes.includes('bet-isc-log-activity-call-details');
});