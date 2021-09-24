'use es6';

import { RangeInputType } from '../InputTypes';
import { defaultIsValue } from './OperatorValidators';
import { makeOperator } from './Operator';
export default makeOperator({
  inputType: RangeInputType,
  name: 'InRange',
  values: [{
    name: 'value',
    isValid: defaultIsValue
  }, {
    name: 'highValue',
    isValid: defaultIsValue
  }]
});