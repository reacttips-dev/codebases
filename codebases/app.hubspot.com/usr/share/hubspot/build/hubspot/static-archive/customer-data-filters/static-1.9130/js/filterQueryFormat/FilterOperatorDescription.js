'use es6';

import { Record } from 'immutable';
var FilterOperatorDescription = Record({
  filterFamily: undefined,
  operator: undefined
});

FilterOperatorDescription.isValid = function (record) {
  return record instanceof FilterOperatorDescription;
};

export default FilterOperatorDescription;