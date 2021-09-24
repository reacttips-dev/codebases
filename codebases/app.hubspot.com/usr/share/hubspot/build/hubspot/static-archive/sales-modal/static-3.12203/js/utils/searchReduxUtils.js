'use es6';

import { List } from 'immutable';
import * as SearchFields from 'SalesContentIndexUI/data/constants/SearchFields';
import SearchQueryRecord from 'SalesContentIndexUI/data/records/SearchQueryRecord';
import filter from 'SalesContentIndexUI/data/utils/filter';
import * as SearchApi from 'sales-modal/api/SearchApi';

var filterByContentType = function filterByContentType(type) {
  return filter(SearchFields.CONTENT_TYPE_FIELD, type);
};

var searchWithTotalsFetch = function searchWithTotalsFetch(action, searchQuery) {
  return function (dispatch) {
    return SearchApi.search(searchQuery).then(function (payload) {
      dispatch(action(payload));
    }).done();
  };
};

export var countAllFetch = function countAllFetch(contentType, action) {
  return searchWithTotalsFetch(action, new SearchQueryRecord({
    filters: List([filterByContentType(contentType)]),
    offset: 0,
    limit: 0
  }));
};