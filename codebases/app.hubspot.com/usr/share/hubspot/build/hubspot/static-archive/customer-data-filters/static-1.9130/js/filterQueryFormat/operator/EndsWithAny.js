'use es6';

import { List } from 'immutable';
import { makeOperator } from './Operator';
export default makeOperator({
  name: 'EndsWithAny',
  values: [{
    name: 'value',
    isValid: function isValid(value) {
      return List.isList(value) && !value.isEmpty();
    },
    defaultValue: List()
  }, {
    name: 'isInexclusive',
    defaultValue: false
  }]
});