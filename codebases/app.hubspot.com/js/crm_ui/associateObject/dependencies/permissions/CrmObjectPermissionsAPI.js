'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { post } from 'crm_data/api/ImmutableAPI';
import { currentUserCanView, currentUserCanEdit, currentUserCanCommunicate, currentUserCanDelete } from './CrmObjectPermissionsConstants';
import { Map as ImmutableMap } from 'immutable';

var parsePermissionsResponse = function parsePermissionsResponse(fetchedCrmObjects, permissionsResponse) {
  return fetchedCrmObjects.reduce(function (acc, crmObject) {
    var _ImmutableMap;

    var objectId = crmObject.get('objectId');
    var objectType = crmObject.get('objectType');
    var viewableObjects = permissionsResponse.get('viewableObjects');
    var editableObjects = permissionsResponse.get('editableObjects');
    var communicatableObjects = permissionsResponse.get('communicatableObjects');
    var deletableObjects = permissionsResponse.get('deletableObjects');
    return acc.set(crmObject, ImmutableMap((_ImmutableMap = {
      objectType: objectType,
      objectId: objectId
    }, _defineProperty(_ImmutableMap, currentUserCanView, viewableObjects.has(objectType) && viewableObjects.get(objectType).includes(objectId)), _defineProperty(_ImmutableMap, currentUserCanEdit, editableObjects.has(objectType) && editableObjects.get(objectType).includes(objectId)), _defineProperty(_ImmutableMap, currentUserCanCommunicate, communicatableObjects.has(objectType) && communicatableObjects.get(objectType).includes(objectId)), _defineProperty(_ImmutableMap, currentUserCanDelete, deletableObjects.has(objectType) && deletableObjects.get(objectType).includes(objectId)), _ImmutableMap)));
  }, ImmutableMap());
};

var getPermissionsRequestBody = function getPermissionsRequestBody(crmObjects) {
  return crmObjects.reduce(function (acc, crmObject) {
    var objectType = crmObject.get('objectType');
    var objectId = crmObject.get('objectId');
    return Object.assign(_defineProperty({}, objectType, acc[objectType] ? acc[objectType].push(objectId) : [objectId]), acc);
  }, {});
};

export var fetchPermissionsForCrmObjects = function fetchPermissionsForCrmObjects(crmObjects) {
  return post('crm-permissions/v1/check-permissions', getPermissionsRequestBody(crmObjects)).then(function (response) {
    return parsePermissionsResponse(crmObjects, response);
  });
};