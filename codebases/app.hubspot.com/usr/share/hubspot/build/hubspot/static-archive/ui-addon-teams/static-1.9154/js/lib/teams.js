'use es6';

import { List } from 'immutable';
export var sortTeamsAlphabetically = function sortTeamsAlphabetically(teams) {
  return teams.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  }).map(function (team) {
    return team.set('childTeams', sortTeamsAlphabetically(team.childTeams));
  });
}; // Expects teams to be the result of HierarchicalTeamReferenceResolver

export var getTeamFromHierarchy = function getTeamFromHierarchy(teams, teamId) {
  var getFlattenedTeams = function getFlattenedTeams(team) {
    var children = team.get('childTeams').map(getFlattenedTeams).reduce(function (acc, list) {
      return acc.concat(list);
    }, List());
    return List.of(team).concat(children);
  };

  teamId = Number(teamId);
  return teams.map(function (team) {
    return team.get('referencedObject');
  }).map(getFlattenedTeams).reduce(function (acc, list) {
    return acc.concat(list);
  }, List()).find(function (team) {
    return team.get('id') === teamId;
  });
};