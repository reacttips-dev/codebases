'use es6';

import { makeOperator } from './Operator';
import isString from 'transmute/isString';
export default makeOperator({
  name: 'EndsWith',
  values: [{
    name: 'value',
    isValid: isString
  }]
});