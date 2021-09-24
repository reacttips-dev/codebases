'use es6';

import { makeOperator } from './Operator';

var isAnyValue = function isAnyValue(value) {
  return value != null;
};

export default makeOperator({
  name: 'EverEqual',
  values: [{
    name: 'value',
    isValid: isAnyValue
  }]
});