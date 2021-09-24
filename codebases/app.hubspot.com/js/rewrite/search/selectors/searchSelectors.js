'use es6';

import { createSelector } from 'reselect';

var getSearchSlice = function getSearchSlice(state) {
  return state.search;
};

export var getSearchTerm = createSelector([getSearchSlice], function (slice) {
  return slice.searchTerm;
});
export var getLastValidSearchTerm = createSelector([getSearchSlice], function (slice) {
  return slice.lastValidSearchTerm;
});