'use es6';

import { NoDisplayType } from '../DisplayTypes';
import { NoInputType } from '../InputTypes';
import { makeOperator } from './Operator';
export default makeOperator({
  displayType: NoDisplayType,
  inputType: NoInputType,
  name: 'WorkflowActive'
});