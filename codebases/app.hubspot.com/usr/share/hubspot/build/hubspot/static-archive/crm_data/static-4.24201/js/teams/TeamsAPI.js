'use es6';

import { Map as ImmutableMap } from 'immutable';
import { get } from '../api/ImmutableAPI';
import map from 'transmute/map';
import pipe from 'transmute/pipe';
import reduce from 'transmute/reduce';
import TeamRecord from 'customer-data-objects/team/TeamRecord';
import toSeq from 'transmute/toSeq';
export var indexTeams = pipe(toSeq, map(TeamRecord), reduce(ImmutableMap(), function (acc, team) {
  return acc.set(String(team.id), team);
}));
export function fetch() {
  return get('app-users/v1/teams').then(indexTeams);
}
export function fetchHierarchy() {
  return get('app-users/v1/teams/hierarchy');
}
export function fetchForUser() {
  return get('app-users/v1/teams/user/all', {
    includeChildTeamMembers: true,
    includeHierarchy: true
  });
}