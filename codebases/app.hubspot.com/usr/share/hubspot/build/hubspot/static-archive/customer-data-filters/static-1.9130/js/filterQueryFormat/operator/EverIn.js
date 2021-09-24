'use es6';

import { List } from 'immutable';
import { makeOperator } from './Operator';
export default makeOperator({
  name: 'EverIn',
  values: [{
    name: 'value',
    defaultValue: List(),
    isValid: function isValid(value) {
      return List.isList(value) && !value.isEmpty();
    }
  }, {
    name: 'isInexclusive',
    defaultValue: true
  }]
});