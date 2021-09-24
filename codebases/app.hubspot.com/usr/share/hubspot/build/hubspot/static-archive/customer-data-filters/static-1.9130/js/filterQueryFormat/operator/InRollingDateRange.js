'use es6';

import { RollingDateDisplayType } from '../DisplayTypes';
import { RollingDateInputType } from '../InputTypes';
import { TODAY } from '../rollingDates/RollingDateOptionValues';
import { makeOperator } from './Operator';
import RollingDateConfig, { validateRollingDateConfig } from '../rollingDates/RollingDateConfig';
import isNumber from 'transmute/isNumber';
export default makeOperator({
  displayType: RollingDateDisplayType,
  inputType: RollingDateInputType,
  name: 'InRollingDateRange',
  values: [{
    defaultValue: RollingDateConfig.fromRollingDateOptionValue(TODAY),
    isIterable: false,
    isValid: validateRollingDateConfig,
    name: 'value'
  }, {
    defaultValue: 0,
    isValid: isNumber,
    name: 'rollingOffset'
  }]
});