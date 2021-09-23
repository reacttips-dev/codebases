'use es6';

import { makeOperator } from './Operator';
import { defaultIsValue } from './OperatorValidators';
export default makeOperator({
  name: 'BeforeDate',
  values: [{
    name: 'value',
    isValid: defaultIsValue
  }]
});