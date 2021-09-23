'use es6';

import { getDefaultProperties } from '../properties/defaults';
import isEmpty from 'transmute/isEmpty';
import getIn from 'transmute/getIn';
var fallbackColumns = [{
  name: 'name',
  label: 'Name'
}, {
  name: 'city'
}, {
  name: 'address'
}, {
  name: 'state'
}];
/**
 * Get default view column config for a given portal-defined CRM Object type.
 * @param {!Object} objectType - instance of CrmObjectTypeRecord
 * @returns {Object}
 */

export var getDefaultColumns = function getDefaultColumns(objectType) {
  var properties = getDefaultProperties(objectType);

  if (isEmpty(properties)) {
    return fallbackColumns;
  }

  return properties.map(function (propertyConfig, name) {
    var canDelete = !getIn(['disabled', 'required'], propertyConfig);
    return canDelete ? {
      name: name
    } : {
      canDelete: canDelete,
      name: name
    };
  }).toArray();
};