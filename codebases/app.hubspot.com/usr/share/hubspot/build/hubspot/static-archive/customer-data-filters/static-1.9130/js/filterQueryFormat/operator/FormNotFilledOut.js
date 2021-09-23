'use es6';

import { __ANY_PAGE } from '../../converters/listSegClassic/ListSegConstants';
import { makeOperator } from './Operator';
import isNumber from 'transmute/isNumber';
import isString from 'transmute/isString';
export default makeOperator({
  isRefinable: true,
  isRefinableExtra: true,
  name: 'FormNotFilledOut',
  values: [{
    defaultValue: __ANY_PAGE,
    name: 'value',
    isValid: function isValid(v) {
      return isNumber(v) || isString(v);
    }
  }, {
    defaultValue: false,
    name: 'isPageSelected'
  }]
});