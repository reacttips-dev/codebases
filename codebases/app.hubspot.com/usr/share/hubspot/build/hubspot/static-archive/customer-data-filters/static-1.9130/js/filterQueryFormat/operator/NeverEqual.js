'use es6';

import { makeOperator } from './Operator';

var isAnyValue = function isAnyValue(value) {
  return value != null;
};

export default makeOperator({
  name: 'NeverEqual',
  values: [{
    name: 'value',
    isValid: isAnyValue
  }]
});