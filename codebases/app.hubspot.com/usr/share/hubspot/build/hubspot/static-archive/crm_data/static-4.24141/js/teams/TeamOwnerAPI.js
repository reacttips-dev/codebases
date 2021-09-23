'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import userInfo from 'hub-http/userInfo';
import { fetchAll as fetchAllOwners } from '../owners/OwnersAPI';
import { Map as ImmutableMap, List, fromJS } from 'immutable';

var _mapUserIdsToOwnerIds = function _mapUserIdsToOwnerIds(owners) {
  return owners.reduce(function (userIds, owner) {
    var remoteUser = owner.remoteList.find(function (remote) {
      return remote.get('remoteType') === 'HUBSPOT' && remote.get('active');
    });

    if (remoteUser) {
      var userId = "" + remoteUser.get('remoteId');
      return userIds.set(userId, owner);
    }

    return userIds;
  }, ImmutableMap());
};

var _getTeammatesByOwnerId = function _getTeammatesByOwnerId(teammates, owners, currentUserId) {
  var userIdToOwner = _mapUserIdsToOwnerIds(owners);

  return teammates.reduce(function (acc, teammateId) {
    if (userIdToOwner.has(teammateId)) {
      acc = acc.push(userIdToOwner.get(teammateId));
    }

    return acc;
  }, List.of(userIdToOwner.get(currentUserId)));
}; // eslint-disable-next-line camelcase


var USER_ID_KEY_NAME = 'user_id';

var _getTeams = function _getTeams(user, owners) {
  var teams = user.teams,
      userId = user[USER_ID_KEY_NAME];
  return teams.reduce(function (acc, team) {
    var id = team.id,
        name = team.name,
        teammates = team.teammates;
    acc = acc.push(fromJS({
      id: id,
      name: name,
      owners: _getTeammatesByOwnerId(teammates.map(function (teammate) {
        return "" + teammate;
      }), owners, "" + userId)
    }));
    return acc;
  }, List());
};

export function fetch() {
  return Promise.all([userInfo(), fetchAllOwners()]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        user = _ref2[0].user,
        owners = _ref2[1];

    return _getTeams(user, owners);
  });
}