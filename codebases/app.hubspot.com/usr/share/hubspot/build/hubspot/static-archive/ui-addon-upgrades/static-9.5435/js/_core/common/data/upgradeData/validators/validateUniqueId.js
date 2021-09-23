'use es6';

import { validateProperty } from 'ui-addon-upgrades/_core/common/data/upgradeData/validators/validateProperty';
export var validateUniqueId = function validateUniqueId(property) {
  var isValidProperty = typeof property === 'string' && property.length > 0;
  return validateProperty(isValidProperty, "expected uniqueId to be a non-empty string but got " + property, 'uniqueId');
};