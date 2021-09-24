'use es6';

import { createSelector } from 'reselect';
export var getInitialQuery = function getInitialQuery(state) {
  return state.initialQuery;
};
export var getPreventRedirect = createSelector([getInitialQuery], function (query) {
  return Boolean(query.noRedirect);
});