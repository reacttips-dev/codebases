'use es6';

import { Set as ImmutableSet } from 'immutable';

function getTeamFromHierarchy(team, targetTeamId) {
  if (team.get('id') === targetTeamId) {
    return team;
  }

  return team.get('childTeams').reduce(function (acc, childTeam) {
    var result = getTeamFromHierarchy(childTeam, targetTeamId);

    if (result) {
      return result;
    }

    return acc;
  }, null);
}

export var getTeam = function getTeam(teams, targetTeamId) {
  return teams.reduce(function (acc, team) {
    if (!acc) {
      var result = getTeamFromHierarchy(team, targetTeamId);

      if (result) {
        return result;
      }
    }

    return acc;
  }, null);
};

function getAllChildTeamIds(team) {
  return team.get('childTeams').reduce(function (acc, childTeam) {
    return acc.add(childTeam.get('id')).union(getAllChildTeamIds(childTeam));
  }, ImmutableSet());
}

export var getAllTeamIds = function getAllTeamIds(teams) {
  return teams.reduce(function (acc, team) {
    return acc.add(team.get('id')).union(getAllChildTeamIds(team));
  }, ImmutableSet());
};

function _getAllParentTeamIdsFromHierarchy(parentIds, team, targetTeamId) {
  if (team.get('id') === targetTeamId) {
    return parentIds;
  }

  return team.get('childTeams').reduce(function (acc, childTeam) {
    var result = _getAllParentTeamIdsFromHierarchy(parentIds.union(ImmutableSet([team.get('id')])), childTeam, targetTeamId);

    if (result) {
      return result;
    }

    return acc;
  }, null);
}

export var getAllParentTeamIdsFromHierarchy = function getAllParentTeamIdsFromHierarchy(team, targetTeamId) {
  return _getAllParentTeamIdsFromHierarchy(ImmutableSet(), team, targetTeamId);
};
export var getAllParentTeamIds = function getAllParentTeamIds(teams, targetTeamId) {
  return teams.reduce(function (acc, team) {
    if (!acc) {
      var result = getAllParentTeamIdsFromHierarchy(team, targetTeamId);

      if (result) {
        return result;
      }
    }

    return acc;
  }, null);
};
export var toggleSelectedTeam = function toggleSelectedTeam(selectedTeams, allTeams, teamId) {
  var isSelected = selectedTeams.includes(teamId);
  var updatedSelectedTeams;

  if (!isSelected) {
    var allParentTeamIds = getAllParentTeamIds(allTeams, teamId);
    updatedSelectedTeams = selectedTeams.add(teamId).union(allParentTeamIds);
  } else {
    updatedSelectedTeams = selectedTeams.remove(teamId).subtract(getAllChildTeamIds(getTeam(allTeams, teamId)));
  }

  return updatedSelectedTeams;
};

var getAllUserIdsInHierarchy = function getAllUserIdsInHierarchy(teamHierarchy, selectedTeamIds) {
  var currentTeamUserIds = ImmutableSet();

  if (!selectedTeamIds || selectedTeamIds && selectedTeamIds.includes(teamHierarchy.get('id'))) {
    currentTeamUserIds = ImmutableSet(teamHierarchy.get('userIds'));
  }

  if (teamHierarchy.get('childTeams').isEmpty()) {
    return currentTeamUserIds;
  }

  return teamHierarchy.get('childTeams').reduce(function (acc, team) {
    return acc.union(getAllUserIdsInHierarchy(team, selectedTeamIds));
  }, currentTeamUserIds);
};

export var getAllUserIdsFromTeams = function getAllUserIdsFromTeams(teams, selectedTeamIds) {
  return teams.reduce(function (acc, team) {
    return acc.union(getAllUserIdsInHierarchy(team, selectedTeamIds));
  }, ImmutableSet());
};
export var areOnlyChildTeams = function areOnlyChildTeams(teams) {
  return teams.reduce(function (_, team) {
    if (!team.get('childTeams') || team.get('childTeams').isEmpty()) {
      return true;
    }

    return false;
  }, true);
};