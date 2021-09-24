'use es6';

import { RollingInequalityDisplayType } from '../DisplayTypes';
import { RollingInequalityInputType } from '../InputTypes';
import { makeOperator } from './Operator';
import isNumber from 'transmute/isNumber';

var isValidDirection = function isValidDirection(direction) {
  return direction === 'forward' || direction === 'backward';
};

export default makeOperator({
  displayType: RollingInequalityDisplayType,
  inputType: RollingInequalityInputType,
  name: 'LessRolling',
  values: [{
    name: 'numberOfDays',
    isValid: isNumber,
    defaultValue: 1
  }, {
    name: 'direction',
    isValid: isValidDirection,
    defaultValue: 'backward'
  }]
});