'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import memoize from 'react-utils/memoize'; // General utilites for navigating a heirachical team data structure

var sortTeamsByName = function sortTeamsByName(teamA, teamB) {
  return teamA.name.toLocaleLowerCase() > teamB.name.toLocaleLowerCase() ? 1 : -1;
};

var getTeamAndSortedChildrenAsFlatList = function getTeamAndSortedChildrenAsFlatList(team, depth) {
  if (team.childTeams.length === 0) {
    return Object.assign({
      depth: depth
    }, team);
  }

  return _toConsumableArray(team.childTeams).sort(sortTeamsByName).reduce(function (list, childTeam) {
    return list.concat(getTeamAndSortedChildrenAsFlatList(childTeam, depth + 1));
  }, [Object.assign({
    depth: depth
  }, team)]);
};

export var getSortedFlattenedTeamsList = function getSortedFlattenedTeamsList(teams) {
  return _toConsumableArray(teams).sort(sortTeamsByName).reduce(function (list, team) {
    return list.concat(getTeamAndSortedChildrenAsFlatList(team, 0));
  }, []);
};
export var getFlattenedTeamsMap = memoize(function (teams) {
  return getSortedFlattenedTeamsList(teams).reduce(function (map, team) {
    map[team.id] = team;
    return map;
  }, {});
}); // Takes an array of 1-many team IDs, for all those teams and all
// of their children, return a list of every unique user on those teams.

export var getUserIdsForSelectedTeamIds = function getUserIdsForSelectedTeamIds(teamIds, teams) {
  var teamsMap = getFlattenedTeamsMap(teams);
  return teamIds.reduce(function (userIds, teamId) {
    var team = teamsMap[teamId]; // ** Edge case **
    // When the user is not allowed to see the full team hierarchy, we don't actually have the full team list, so
    // in some instances if a teamId is assigned to an asset we may not have the corresponding record, in which case
    // we just aren't showing that teams info.

    if (!team) {
      return userIds;
    }

    return userIds.concat(team.userIds).concat(team.secondaryUserIds);
  }, []);
}; // For a list of userIds, find all the userIds that are tied to a given team, return
// on userIds that are not part of any of the listed teamIds.

export var getExplicitlySelectedUserIds = function getExplicitlySelectedUserIds(selectedUserIds, selectedTeamIds, teams) {
  var userIdsForSelectedTeamIds = getUserIdsForSelectedTeamIds(selectedTeamIds, teams);
  return selectedUserIds.filter(function (userId) {
    return !userIdsForSelectedTeamIds.includes(userId);
  });
}; // Takes a single team ID, returns an array of all child team ID's for the team

export var getAllChildTeamIdsForParentTeamId = memoize(function (parentTeamId, teams) {
  var teamsMap = getFlattenedTeamsMap(teams);
  var parentTeam = teamsMap[parentTeamId];

  if (parentTeam.childTeams.length === 0) {
    return [];
  }

  return getTeamAndSortedChildrenAsFlatList(parentTeam).map(function (team) {
    return team.id;
  }).slice(1);
}); // Takes a single team ID, returns an array of all the parents for that child

export var getAllParentTeamIdsForChildTeamId = memoize(function (childTeamId, teams) {
  var teamsMap = getFlattenedTeamsMap(teams);
  var childTeam = teamsMap[childTeamId];
  var parentTeamId = childTeam.parentTeamId;
  var parentTeamIds = [];

  while (parentTeamId !== null) {
    // ** Edge case **
    // When the user is not allowed to see the full team hierarchy, we don't actually have the full team list, so
    // if they have a parent team we only get the teams below the one the user is on, so we have a stray team ID
    // In this case the user will only know all the parents up to the team they are on, but not above.
    if (!teamsMap[parentTeamId]) {
      break;
    }

    parentTeamIds.push(parentTeamId);
    parentTeamId = teamsMap[parentTeamId].parentTeamId;
  }

  return parentTeamIds;
});
export var getRootLevelTeamIds = memoize(function (teams) {
  return teams.map(function (_ref) {
    var id = _ref.id;
    return id;
  });
});