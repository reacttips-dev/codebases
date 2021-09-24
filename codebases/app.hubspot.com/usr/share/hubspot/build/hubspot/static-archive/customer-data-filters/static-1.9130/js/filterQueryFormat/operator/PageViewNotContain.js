'use es6';

import { makeOperator } from './Operator';
import isString from 'transmute/isString';
export default makeOperator({
  name: 'PageViewNotContain',
  isRefinable: true,
  isRefinableExtra: true,
  values: [{
    name: 'value',
    isValid: isString
  }]
});