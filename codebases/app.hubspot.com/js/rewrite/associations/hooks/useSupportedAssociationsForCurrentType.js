'use es6';

import { useAssociationsForCurrentType } from './useAssociationsForCurrentType';
import { isSupportedGridAssociation } from '../utils/isSupportedGridAssociation';
import memoizeOne from 'react-utils/memoizeOne';
export var generateAssociations = memoizeOne(function (associationsForObjectTypeId) {
  return Object.keys(associationsForObjectTypeId).reduce(function (acc, key) {
    var associationDefinition = associationsForObjectTypeId[key];

    if (isSupportedGridAssociation(associationDefinition)) {
      acc[key] = associationDefinition;
    }

    return acc;
  }, {});
});
export var useSupportedAssociationsForCurrentType = function useSupportedAssociationsForCurrentType() {
  var associationsForObjectTypeId = useAssociationsForCurrentType();
  return generateAssociations(associationsForObjectTypeId);
};