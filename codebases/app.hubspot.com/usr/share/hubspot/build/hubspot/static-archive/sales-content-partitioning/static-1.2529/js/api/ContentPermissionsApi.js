'use es6';

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
var baseUrl = '/contentpermissions/v1/permissions';
export var fetchPermissionsForContent = function fetchPermissionsForContent(_ref) {
  var objectId = _ref.objectId,
      objectType = _ref.objectType;
  return apiClient.get(baseUrl, {
    query: {
      objectId: objectId,
      objectType: objectType
    }
  }).then(function (_ref2) {
    var isPrivate = _ref2.private,
        visibleToAll = _ref2.visibleToAll,
        _ref2$permissions = _ref2.permissions,
        TEAM = _ref2$permissions.TEAM,
        USER = _ref2$permissions.USER;
    return ImmutableMap({
      private: isPrivate,
      visibleToAll: visibleToAll,
      permissions: ImmutableMap({
        TEAM: ImmutableSet(TEAM),
        USER: ImmutableSet(USER)
      })
    });
  });
};
export var saveContentPermissions = function saveContentPermissions(_ref3) {
  var objectId = _ref3.objectId,
      objectType = _ref3.objectType,
      selectedTeams = _ref3.selectedTeams,
      selectedUsers = _ref3.selectedUsers,
      visibleToAll = _ref3.visibleToAll,
      isPrivate = _ref3.private;
  return apiClient.put(baseUrl, {
    data: {
      objectType: objectType,
      objectIds: [objectId],
      permissions: {
        TEAM: selectedTeams,
        USER: selectedUsers
      },
      visibleToAll: visibleToAll,
      private: isPrivate
    }
  });
};