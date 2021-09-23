'use es6';

import * as Operators from 'customer-data-filters/filterQueryFormat/operator/Operators';
import * as PropertyTypes from 'customer-data-objects/property/PropertyTypes';
var supportedNumberOperators = [Operators.Equal, Operators.NotEqual, Operators.Less, Operators.LessOrEqual, Operators.Greater, Operators.GreaterOrEqual];
export var mayIncludeObjectsWithNoAssociatedObjects = function mayIncludeObjectsWithNoAssociatedObjects(operator) {
  switch (operator.field.type) {
    case PropertyTypes.NUMBER:
      return supportedNumberOperators.includes(operator.constructor);

    default:
      return false;
  }
};