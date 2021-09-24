'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { Record, Set as ImmutableSet, List } from 'immutable';
var Team = Record({
  id: null,
  name: '',
  userIds: ImmutableSet(),
  parentTeamId: null,
  childTeams: List(),
  secondaryUserIds: List()
});

Team.from = function (json) {
  return new Team(Object.assign({}, json, {
    userIds: json.userIds && typeof json.userIds[Symbol.iterator] === 'function' ? ImmutableSet(json.userIds) : ImmutableSet(),
    teamIds: json.teamIds && typeof json.teamIds[Symbol.iterator] === 'function' ? ImmutableSet(json.teamIds) : ImmutableSet(),
    childTeams: json.childTeams && typeof json.childTeams[Symbol.iterator] === 'function' ? List(json.childTeams).map(Team.from) : List(),
    secondaryUserIds: json.secondaryUserIds && typeof json.secondaryUserIds[Symbol.iterator] === 'function' ? List(json.secondaryUserIds) : List()
  }));
};

Team.fromMap = function (map) {
  return new Team(map).set('childTeams', map.get('childTeams').map(Team.fromMap));
};

Team.fromArray = function (arr) {
  return List.of.apply(List, _toConsumableArray(arr)).map(function (team) {
    return Team.from(team);
  });
};

Team.fromReference = function (ref) {
  return Team.fromMap(ref.get('referencedObject'));
};

export default Team;