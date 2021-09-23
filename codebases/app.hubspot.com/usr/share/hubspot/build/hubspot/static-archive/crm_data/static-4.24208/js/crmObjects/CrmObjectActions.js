'use es6';

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import invariant from 'react-utils/invariant';
import * as Dispatch from 'crm_data/dispatch/Dispatch';
import { CRM_OBJECTS_UPDATED, CRM_OBJECTS_UPDATE_FAILED, CRM_OBJECTS_UPDATE_STARTED, CRM_OBJECTS_UPDATE_SUCCEEDED } from 'crm_data/actions/ActionTypes';
import { toCrmObjectKey } from 'customer-data-objects/crmObject/CrmObjectKey';
import * as ImmutableModel from 'customer-data-objects/model/ImmutableModel';
import * as CrmObjectAPI from 'crm_data/crmObjects/CrmObjectAPI';
import { dispatchImmediate } from 'crm_data/dispatch/Dispatch';
export function updateCrmObjectProperties(crmObject, nextProperties, options) {
  if (options == null) {
    options = {};
  }

  var crmObjectActionPayload = {
    id: toCrmObjectKey({
      objectId: ImmutableModel.getId(crmObject),
      objectTypeId: crmObject.objectTypeId
    }),
    nextProperties: nextProperties,
    properties: nextProperties.map(function (_, name) {
      return ImmutableModel.getProperty(crmObject, name);
    }),
    options: options
  };
  dispatchImmediate(CRM_OBJECTS_UPDATE_STARTED, crmObjectActionPayload);
  return CrmObjectAPI.updateCrmObjectProperties(crmObject, nextProperties).then(function (updatedObject) {
    dispatchImmediate(CRM_OBJECTS_UPDATE_SUCCEEDED, {
      id: toCrmObjectKey({
        objectId: ImmutableModel.getId(updatedObject),
        objectTypeId: updatedObject.objectTypeId
      }),
      nextProperties: nextProperties
    });
  }).catch(function (error) {
    dispatchImmediate(CRM_OBJECTS_UPDATE_FAILED, Object.assign({}, crmObjectActionPayload, {
      error: error
    }));
  });
}
export function updateCrmObjects(crmObjects, objectTypeId) {
  invariant(ImmutableMap.isMap(crmObjects), 'CrmObjectActions: expected crmObjects to be a Map but got `%s`', crmObjects);
  var crmObjectsWithObjectTypeKey = crmObjects.mapKeys(function (objectId, object) {
    return toCrmObjectKey({
      objectId: objectId,
      objectTypeId: objectTypeId || object.objectTypeId
    });
  });
  return Dispatch.dispatchImmediate(CRM_OBJECTS_UPDATED, crmObjectsWithObjectTypeKey);
}
export function deleteObject(objectTypeId, objectId, callback) {
  return CrmObjectAPI.deleteObject(objectTypeId, objectId).then(function () {
    setTimeout(function () {
      dispatchImmediate(CRM_OBJECTS_UPDATED, ImmutableMap().set(toCrmObjectKey({
        objectId: objectId,
        objectTypeId: objectTypeId
      }), null));
    }, 0);
    return typeof callback === 'function' ? callback() : undefined;
  });
}
export function refresh(ids, objectTypeId) {
  Dispatch.dispatchQueue('CRM_OBJECTS_REFRESH_QUEUED', ImmutableSet(ids.map(function (objectId) {
    return toCrmObjectKey({
      objectId: objectId,
      objectTypeId: objectTypeId
    });
  })));
}