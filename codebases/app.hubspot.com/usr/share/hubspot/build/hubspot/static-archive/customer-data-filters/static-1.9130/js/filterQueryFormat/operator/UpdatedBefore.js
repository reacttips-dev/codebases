'use es6';

import { PropertyDisplayType } from '../DisplayTypes';
import { PropertyInputType } from '../InputTypes';
import { makeOperator } from './Operator';
import isString from 'transmute/isString';
export default makeOperator({
  displayType: PropertyDisplayType,
  inputType: PropertyInputType,
  name: 'UpdatedBefore',
  values: [{
    name: 'value',
    isValid: isString
  }]
});