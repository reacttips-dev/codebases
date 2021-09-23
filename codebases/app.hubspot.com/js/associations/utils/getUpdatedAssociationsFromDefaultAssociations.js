'use es6';

import { Map as ImmutableMap } from 'immutable';
export default function getUpdatedAssociationsFromDefaultAssociations(defaultAssociations, associationsFromContext) {
  var updatedAssociations = ImmutableMap();
  defaultAssociations.forEach(function (objectIds, objectTypeId) {
    var associationCategory = associationsFromContext.getIn([objectTypeId, 'associationCategory']);
    var associationTypeId = associationsFromContext.getIn([objectTypeId, 'associationTypeId']);
    updatedAssociations = updatedAssociations.set(objectTypeId, ImmutableMap({
      associationCategory: associationCategory,
      associationTypeId: associationTypeId
    }));
    objectIds.forEach(function (objectId) {
      updatedAssociations = updatedAssociations.setIn([objectTypeId, 'associationOptionRecords', objectId], ImmutableMap({
        isDefaultAssociation: true,
        isSelected: true,
        objectId: objectId
      }));
    });
  });
  return updatedAssociations;
}