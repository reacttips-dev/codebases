'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { fromJS, List, Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { configure } from '../configure';
import { get as getOwners } from '../references/owner/owners';
import { get as getTeams } from '../references/team/teams';
var quotaAccessScopes = {
  'sales-goal-assignment': true,
  'advanced-sales-goal-assignment': true,
  'basic-sales-goal-manager': true,
  'advanced-sales-goal-manager': true,
  'legacy-quotas-access': true,
  'legacy-sales-goal-assignment': true
};
export var quotaGates = ImmutableMap(quotaAccessScopes).keySeq().toArray();
export var hasGoalsAccess = function hasGoalsAccess(userInfo) {
  var _userInfo$user = userInfo.user;
  _userInfo$user = _userInfo$user === void 0 ? {} : _userInfo$user;
  var _userInfo$user$scopes = _userInfo$user.scopes,
      scopes = _userInfo$user$scopes === void 0 ? [] : _userInfo$user$scopes;
  return scopes.reduce(function (hasAccess, scope) {
    return hasAccess || Boolean(quotaAccessScopes[scope]);
  }, false);
};
export var hasQuotaSeries = function hasQuotaSeries(report) {
  return report.getIn(['displayParams', 'customSeries'], List()).some(function (cs) {
    return cs === 'datetime.quota';
  });
};

var getOwnerQuota = function getOwnerQuota(obj) {
  return fromJS(obj).getIn(['quota']);
};

var getCustomFilters = function getCustomFilters(obj) {
  return fromJS(obj).getIn(['filters', 'custom']);
};

var isDealOwnersFilter = function isDealOwnersFilter(filter) {
  return filter.get('property') === 'hubspot_owner_id' || filter.get('property') === 'engagement.ownerId';
};

var isDealTeamFilter = function isDealTeamFilter(filter) {
  return filter.get('property') === 'hubspot_team_id' || filter.get('property') === 'engagement.teamId';
};

export var getTeamsFilter = function getTeamsFilter(report) {
  var filters = getCustomFilters(report) || List();
  return filters.find(isDealTeamFilter);
};
export var getOwnersFilter = function getOwnersFilter(report) {
  var filters = getCustomFilters(report) || List();
  return filters.find(isDealOwnersFilter);
};

var ownerInSet = function ownerInSet(set) {
  return function (owner) {
    return set.has(owner.get('ownerId'));
  };
};

var remoteInSet = function remoteInSet(set) {
  return function (owner) {
    var remotes = owner.get('remoteList');
    return remotes.some(function (remote) {
      return set.has(remote.get('remoteId'));
    });
  };
};

var getSelectedOwners = function getSelectedOwners(report, owners, teams) {
  // TODO once reporting-data supports __hs__ME and __hs__MY_TEAM we need to handle that case
  var ownersFilter = getOwnersFilter(report);
  var teamsFilter = getTeamsFilter(report);
  var owneresFromFilter = ownersFilter && (ownersFilter.get('values') || [ownersFilter.get('value')]).map(Number);
  var uniqueFilterOwners = owneresFromFilter ? ImmutableSet(owneresFromFilter) : ImmutableSet();
  var selectedOwners = owners.filter(function (v) {
    return v != null;
  }).toSet().union(uniqueFilterOwners.map(function (ownerId) {
    return ImmutableMap({
      ownerId: ownerId,
      remoteList: List()
    });
  }));

  if (ownersFilter != null) {
    if (ownersFilter.get('operator') === 'IN') {
      selectedOwners = selectedOwners.filter(ownerInSet(uniqueFilterOwners));
    } else if (ownersFilter.get('operator') === 'NOT_IN') {
      selectedOwners = selectedOwners.filterNot(ownerInSet(uniqueFilterOwners));
    }
  }

  if (teamsFilter != null) {
    var teamFilterRemotes = teamsFilter.get('values', List()).map(Number).map(function (teamId) {
      var found = teams.find(function (team) {
        return team.get('id') === teamId;
      }) || ImmutableMap();
      return found.get('userIds').map(String);
    }).flatten(1).toSet();

    if (teamsFilter.get('operator') === 'IN') {
      selectedOwners = selectedOwners.filter(remoteInSet(teamFilterRemotes));
    } else if (teamsFilter.get('operator') === 'NOT_IN') {
      selectedOwners = selectedOwners.filterNot(remoteInSet(teamFilterRemotes));
    }
  }

  return selectedOwners;
};

export var getReportOwners = function getReportOwners(report) {
  return Promise.all([configure(report.get('config')), getOwners(), getTeams()]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 3),
        configured = _ref2[0],
        owners = _ref2[1],
        teams = _ref2[2];

    var ownersFilter = getOwnersFilter(configured);
    var teamsFilter = getTeamsFilter(configured);
    return ownersFilter || teamsFilter ? getSelectedOwners(configured, fromJS(owners), fromJS(teams)) : null;
  });
};
export var getQuota = function getQuota(report) {
  return Promise.all([configure(report.get('config')), getOwners(), getTeams()]).then(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 3),
        configured = _ref4[0],
        owners = _ref4[1],
        teams = _ref4[2];

    return getSelectedOwners(configured, fromJS(owners), fromJS(teams)).map(getOwnerQuota).filter(function (quota) {
      return typeof quota === 'number';
    }).reduce(function (a, b) {
      return a + b;
    }, 0);
  });
};