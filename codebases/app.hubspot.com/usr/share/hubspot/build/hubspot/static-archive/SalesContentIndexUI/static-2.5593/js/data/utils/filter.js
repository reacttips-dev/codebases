'use es6';

import { List, Map as ImmutableMap, fromJS } from 'immutable';
import * as SearchFields from 'SalesContentIndexUI/data/constants/SearchFields';
import SearchFilterRecord from 'SalesContentIndexUI/data/records/SearchFilterRecord';

var filter = function filter(field) {
  return function (values) {
    return SearchFilterRecord({
      field: field,
      values: values.reduce(function (valueList, value) {
        return value ? valueList.push(value) : valueList;
      }, List())
    });
  };
};

var SearchFilterMap = fromJS(SearchFields).reduce(function (filterMap, field) {
  return filterMap.set(field, filter(field));
}, ImmutableMap());
export default (function (filterKey) {
  for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  return SearchFilterMap.get(filterKey)(values);
});