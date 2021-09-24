'use es6';

import { defaultIsValue } from './OperatorValidators';
import { makeOperator } from './Operator';
export default makeOperator({
  name: 'SurveyMonkeyHasAnswered',
  values: [{
    name: 'value',
    isValid: defaultIsValue
  }]
});