'use es6';

import * as Operators from 'customer-data-filters/filterQueryFormat/operator/Operators';
var unsupportedOperators = [Operators.UpdatedAfter, Operators.UpdatedBefore];
export var operatorSupportsExternalOptions = function operatorSupportsExternalOptions(operator) {
  return !unsupportedOperators.includes(operator.constructor);
};