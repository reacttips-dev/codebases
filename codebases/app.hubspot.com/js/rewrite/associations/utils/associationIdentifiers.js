'use es6';

import get from 'transmute/get';
export var isPrimaryAssociation = function isPrimaryAssociation(associationDefinition) {
  return !!associationDefinition.isPrimary;
}; // General association definitions contain all the associations for a given
// object->object relationship regardless of their association type
//
// Note: These are also known as Unlabeled Associations, currently the
// terminology is used interchangbly.

export var isGeneralAssociation = function isGeneralAssociation(associationDefinition) {
  return get('hasAllAssociatedObjects', associationDefinition);
};