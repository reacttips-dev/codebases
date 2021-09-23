'use es6';

import { createSelector } from 'reselect';

var getTeamsSlice = function getTeamsSlice(state) {
  return state.teams;
};

export var getTeamsFetchStatus = createSelector([getTeamsSlice], function (slice) {
  return slice.status;
});
export var getTeams = createSelector([getTeamsSlice], function (slice) {
  return slice.teams;
});