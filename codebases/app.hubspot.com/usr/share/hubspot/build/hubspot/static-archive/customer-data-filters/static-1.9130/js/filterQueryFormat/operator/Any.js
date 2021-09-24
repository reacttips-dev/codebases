'use es6';

import { NoInputType } from '../InputTypes';
import { makeOperator } from './Operator';
export default makeOperator({
  inputType: NoInputType,
  name: 'Any'
});