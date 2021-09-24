'use es6';

import { defaultIsValue } from './OperatorValidators';
import { makeOperator } from './Operator';
export default makeOperator({
  name: 'GreaterOrEqual',
  values: [{
    name: 'value',
    isValid: defaultIsValue
  }]
});