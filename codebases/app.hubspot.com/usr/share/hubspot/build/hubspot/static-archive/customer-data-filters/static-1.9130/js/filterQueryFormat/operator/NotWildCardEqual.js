'use es6';

import { List } from 'immutable';
import { STRING } from 'customer-data-objects/property/PropertyTypes';
import { isValidQuery } from 'customer-data-objects/search/ElasticSearchQuery';
import { makeOperator } from './Operator';
export default makeOperator({
  name: 'NotWildCardEqual',
  values: [{
    name: 'value',
    defaultValue: List(),
    isValid: function isValid(value, field) {
      return field.type === STRING && List.isList(value) && !value.isEmpty() && value.every(isValidQuery);
    }
  }]
});