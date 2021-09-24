'use es6';

import { List, Map as ImmutableMap, Set as ImmutableSet, fromJS } from 'immutable';
import emptyFunction from 'react-utils/emptyFunction';
import isEmpty from 'transmute/isEmpty';
/**
 * Get map of default properties for a given objectType.
 * Emulates 'customer-data-objects/constants/DefaultObjectProperties'
 * but for portal-defined CRM Object types.
 *
 * @param {!Object} objectType - instance of CrmObjectTypeRecord
 * @returns {Map}
 */

export var getDefaultProperties = function getDefaultProperties(objectType) {
  if (isEmpty(objectType)) {
    return ImmutableMap();
  }

  var primaryDisplayProperty = objectType.primaryDisplayLabelPropertyName;
  var secondaryDisplayProperties = objectType.secondaryDisplayLabelPropertyNames;
  var requiredProperties = objectType.requiredProperties;
  var defaultSearchProperties = objectType.defaultSearchPropertyNames;
  return ImmutableSet.of(List.of(primaryDisplayProperty), secondaryDisplayProperties, defaultSearchProperties, requiredProperties).flatten(true).filter(emptyFunction.thatReturnsArgument).reduce(function (acc, name) {
    return acc.set(name, fromJS({
      required: requiredProperties ? requiredProperties.includes(name) : false,
      disabled: {
        removal: false,
        required: name === primaryDisplayProperty
      }
    }));
  }, ImmutableMap());
};