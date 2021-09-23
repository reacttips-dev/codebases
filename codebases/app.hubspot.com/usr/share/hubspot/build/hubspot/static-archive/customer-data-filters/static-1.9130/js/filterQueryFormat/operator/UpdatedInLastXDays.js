'use es6';

import { RollingPropertyUpdatedDisplayType } from '../DisplayTypes';
import { RollingPropertyUpdatedInputType } from '../InputTypes';
import { makeOperator } from './Operator';
import isNumber from 'transmute/isNumber';
export default makeOperator({
  displayType: RollingPropertyUpdatedDisplayType,
  inputType: RollingPropertyUpdatedInputType,
  name: 'UpdatedInLastXDays',
  values: [{
    name: 'numberOfDays',
    isValid: isNumber
  }]
});