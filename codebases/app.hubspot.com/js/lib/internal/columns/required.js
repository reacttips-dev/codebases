'use es6';

import { getDefaultProperties } from '../properties/defaults';
import isEmpty from 'transmute/isEmpty';
import getIn from 'transmute/getIn';
/**
 * Get required columns for a given portal-defined CRM Object type
 * @param {!Object} objectType - instance of CrmObjectTypeRecord
 * @returns {Object}
 */

export var getRequiredColumns = function getRequiredColumns(objectType) {
  var properties = getDefaultProperties(objectType);

  if (isEmpty(properties)) {
    return [];
  }

  return properties.filter(function (propertyConfig) {
    return getIn(['disabled', 'required'], propertyConfig);
  }).keySeq().toArray();
};