'use es6';

import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import AssociationTypeToAssociationTypeId from 'crm_data/associations/AssociationTypeToAssociationTypeId';
import { HUBSPOT_DEFINED } from 'crm_schema/association/AssociationCategoryTypes';
var API = 'associations/v1/associations/';
export function fetch(key) {
  var objectType = key.get('objectType');
  var objectId = key.get('objectId');
  var associationType = key.get('associationType');
  var limit = key.get('limit');
  var offset = key.get('offset');
  var URI = "" + API + objectType + "/" + objectId + "/" + associationType;
  var query = {};

  if (offset) {
    query.offset = offset;
  }

  if (limit) {
    query.limit = limit;
  }

  return ImmutableAPI.get(URI, query);
}
export function associateObject(_ref) {
  var subjectId = _ref.subjectId,
      objectIds = _ref.objectIds,
      associationType = _ref.associationType,
      associationCategory = _ref.associationCategory,
      associationTypeId = _ref.associationTypeId;
  var associations = objectIds.map(function (objectId) {
    return {
      fromObjectId: subjectId,
      toObjectId: objectId,
      associationCategory: associationCategory || HUBSPOT_DEFINED,
      associationTypeId: associationTypeId || AssociationTypeToAssociationTypeId.get(associationType)
    };
  });
  return ImmutableAPI.put('associations-writes/v1/associations', associations);
}
export function disassociateCrmObject(_ref2) {
  var engagementId = _ref2.engagementId,
      objectId = _ref2.objectId,
      associationTypeId = _ref2.associationTypeId,
      associationCategory = _ref2.associationCategory;
  var associationToRemove = [{
    fromObjectId: engagementId,
    toObjectId: objectId,
    associationCategory: associationCategory,
    associationTypeId: associationTypeId
  }];
  return ImmutableAPI.put(API + "/delete", associationToRemove);
}
export function disassociateObject(_ref3) {
  var subjectId = _ref3.subjectId,
      objectId = _ref3.objectId,
      associationType = _ref3.associationType;
  return ImmutableAPI.delete("" + API + subjectId + "/" + associationType + "/" + objectId);
}
export function fetchAssociationDefinition(fromObjectTypeId, toObjectType) {
  return ImmutableAPI.get("associations/v1/definitions/" + fromObjectTypeId + "/" + toObjectType).then(function (res) {
    if (!res.size) {
      throw new Error('Association definition does not exist');
    }

    return res.first();
  }).catch(function (error) {
    throw error;
  });
}
export function fetchAllAssociationDefinitions(fromObjectTypeId) {
  return ImmutableAPI.get("associations/v1/definitions/from-object-types?objectTypeId=" + fromObjectTypeId);
}