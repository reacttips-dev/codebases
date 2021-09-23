'use es6';

import { RequestStatus } from '../Constants';
export var getIsTeamsRequestSucceeded = function getIsTeamsRequestSucceeded(state) {
  return state.teams.get('status') === RequestStatus.SUCCEEDED;
};
export var getPortalTeams = function getPortalTeams(state) {
  return state.teams.get('teams');
};