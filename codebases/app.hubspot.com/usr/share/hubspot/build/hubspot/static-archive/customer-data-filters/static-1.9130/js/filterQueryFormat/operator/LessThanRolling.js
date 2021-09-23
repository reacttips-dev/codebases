'use es6';

import { RollingWithUnitDisplayType } from '../DisplayTypes';
import { RollingWithUnitInputType } from '../InputTypes';
import { makeOperator } from './Operator';
import isNumber from 'transmute/isNumber';

var isValidDirection = function isValidDirection(direction) {
  return direction === 'forward' || direction === 'backward';
};

var isValidTimeUnit = function isValidTimeUnit(timeUnit) {
  return timeUnit === 'days' || timeUnit === 'weeks';
};

export default makeOperator({
  displayType: RollingWithUnitDisplayType,
  inputType: RollingWithUnitInputType,
  name: 'LessThanRolling',
  values: [{
    defaultValue: 1,
    name: 'value',
    isValid: isNumber
  }, {
    defaultValue: 'backward',
    name: 'direction',
    isValid: isValidDirection
  }, {
    defaultValue: 'days',
    name: 'timeUnit',
    isValid: isValidTimeUnit
  }]
});