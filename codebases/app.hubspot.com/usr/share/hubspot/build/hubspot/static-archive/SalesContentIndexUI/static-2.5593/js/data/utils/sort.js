'use es6';

import { Map as ImmutableMap, fromJS } from 'immutable';
import * as SearchFields from 'SalesContentIndexUI/data/constants/SearchFields';
import SearchSortRecord from 'SalesContentIndexUI/data/records/SearchSortRecord';

var sort = function sort(field) {
  return function (order) {
    return SearchSortRecord({
      field: field,
      order: order
    });
  };
};

var SearchSortMap = fromJS(SearchFields).reduce(function (filterMap, field) {
  return filterMap.set(field, sort(field));
}, ImmutableMap());
export default (function (filterKey, order) {
  return SearchSortMap.get(filterKey)(order);
});