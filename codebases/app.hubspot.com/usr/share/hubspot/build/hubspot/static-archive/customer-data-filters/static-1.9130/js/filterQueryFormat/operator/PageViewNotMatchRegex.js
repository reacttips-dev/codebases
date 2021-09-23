'use es6';

import { makeOperator } from './Operator';
import isString from 'transmute/isString';
import { RegexString } from '../DisplayTypes';
export default makeOperator({
  name: 'PageViewNotMatchRegex',
  isRefinable: true,
  isRefinableExtra: true,
  values: [{
    name: 'value',
    isValid: isString
  }],
  displayType: RegexString
});