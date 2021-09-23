'use es6';

import { UrlInputType } from '../InputTypes';
import { makeOperator } from './Operator';
import isString from 'transmute/isString';
export default makeOperator({
  inputType: UrlInputType,
  name: 'PageViewEqual',
  isRefinable: true,
  isRefinableExtra: true,
  values: [{
    name: 'value',
    isValid: isString
  }]
});