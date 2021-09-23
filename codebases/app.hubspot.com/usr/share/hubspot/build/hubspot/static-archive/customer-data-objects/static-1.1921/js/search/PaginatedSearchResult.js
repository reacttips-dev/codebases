'use es6';

import { fromJS, List, Record } from 'immutable';
import isInstanceOf from 'transmute/isInstanceOf';
import isObject from 'transmute/isObject';
var PaginatedSearchResult = Record({
  query: null,
  results: List(),
  hasMore: false,
  offset: 0,
  total: 0
}, 'PaginatedSearchResult');

PaginatedSearchResult.fromJS = function (json) {
  if (!isObject(json)) {
    return json;
  }

  return PaginatedSearchResult(Object.assign({}, json, {
    results: fromJS(json.results)
  }));
};

PaginatedSearchResult.isPaginatedSearchResult = isInstanceOf(PaginatedSearchResult);
export default PaginatedSearchResult;