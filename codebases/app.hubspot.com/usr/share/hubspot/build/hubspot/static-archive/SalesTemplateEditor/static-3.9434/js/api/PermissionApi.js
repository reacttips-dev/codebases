'use es6';

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
var CONTENT_PERMISSIONS = 'contentpermissions/v1/permissions';
var TEMPLATE_CONTENT_TYPE = 'TEMPLATE';
export default {
  fetchById: function fetchById(objectId) {
    return apiClient.get(CONTENT_PERMISSIONS, {
      query: {
        objectId: objectId,
        objectType: TEMPLATE_CONTENT_TYPE
      }
    }).then(function (_ref) {
      var isPrivate = _ref.private,
          visibleToAll = _ref.visibleToAll,
          _ref$permissions = _ref.permissions,
          TEAM = _ref$permissions.TEAM,
          USER = _ref$permissions.USER;
      return ImmutableMap({
        private: isPrivate,
        visibleToAll: visibleToAll,
        permissions: ImmutableMap({
          TEAM: ImmutableSet(TEAM),
          USER: ImmutableSet(USER)
        })
      });
    });
  },
  save: function save(savedTemplate, permissionsData) {
    var data = {
      objectIds: [savedTemplate.get('id')],
      objectType: TEMPLATE_CONTENT_TYPE,
      visibleToAll: permissionsData.get('visibleToAll'),
      private: permissionsData.get('private'),
      permissions: {
        TEAM: permissionsData.getIn(['permissions', 'TEAM']).toArray(),
        USER: permissionsData.getIn(['permissions', 'USER']).toArray()
      }
    };
    return apiClient.put(CONTENT_PERMISSIONS, {
      data: data
    });
  }
};