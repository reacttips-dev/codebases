'use es6';

import AssociationsStore from 'crm_data/associations/AssociationsStore';
import { LOADING } from 'crm_data/constants/LoadingStatus';
import { getAssociatedRecordsFromIds } from 'crm_data/associations/AssociationOptionsDependencyHelpers';
export function getAssociationsFromStore(objectType, objectId, objectTypeToFetch) {
  var associations = AssociationsStore.get({
    objectType: objectType,
    objectId: objectId,
    associationType: objectType + "_TO_" + objectTypeToFetch
  });

  if (!associations) {
    return LOADING;
  }

  return getAssociatedRecordsFromIds(associations.get('results'), objectTypeToFetch);
}
export function getAssociatedObjectIdFromStore(objectType, objectId, objectTypeToFetch) {
  var associations = AssociationsStore.get({
    objectType: objectType,
    objectId: objectId,
    associationType: objectType + "_TO_" + objectTypeToFetch
  });

  if (!associations) {
    return LOADING;
  }

  return associations.get('results');
}