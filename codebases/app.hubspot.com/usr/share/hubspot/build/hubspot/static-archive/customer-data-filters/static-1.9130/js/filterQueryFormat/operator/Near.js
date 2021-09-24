'use es6';

import { makeOperator } from './Operator';
var zipcodePattern = /^\d{5}(-\d{4})?$/;
/**
 * A special operator for distance queries against zipcodes.
 */

export default makeOperator({
  name: 'Near',
  values: [{
    name: 'value',
    defaultValue: '',
    isValid: function isValid(value) {
      return zipcodePattern.test(value);
    }
  }]
});