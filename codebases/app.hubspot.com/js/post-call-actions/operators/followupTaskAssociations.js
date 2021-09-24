'use es6';

import { Map as ImmutableMap } from 'immutable';
export var convertToFormattedTaskAssociation = function convertToFormattedTaskAssociation(originalEngagementAssociation, taskAssociationDefinition) {
  // Use the category and association type id of the task association definition
  var associationSpec = ImmutableMap({
    associationCategory: taskAssociationDefinition.get('category'),
    associationTypeId: taskAssociationDefinition.get('id')
  }); // Use the associationOptionRecordsMap and objectIds of the call engagement

  var associationOptionRecordsMap = originalEngagementAssociation.get('associationOptionRecordsMap');
  var objectIds = originalEngagementAssociation.get('objectIds');
  return ImmutableMap({
    associationSpec: associationSpec,
    objectIds: objectIds,
    associationOptionRecordsMap: associationOptionRecordsMap
  });
};
export function formatTaskAssociations(callAssociations, taskAssociationDefinitions) {
  return callAssociations.reduce(function (acc, originalEngagementAssociation, toObjectTypeId) {
    // find the task association definition with the same to object type
    var taskAssociationDefinition = taskAssociationDefinitions.find(function (assocToFind) {
      return assocToFind.get('toObjectTypeId') === toObjectTypeId;
    }); // if an association doesn't exist, don't add anything to the accumulator

    if (!taskAssociationDefinition) return acc;
    return acc.set(toObjectTypeId, convertToFormattedTaskAssociation(originalEngagementAssociation, taskAssociationDefinition));
  }, ImmutableMap());
}