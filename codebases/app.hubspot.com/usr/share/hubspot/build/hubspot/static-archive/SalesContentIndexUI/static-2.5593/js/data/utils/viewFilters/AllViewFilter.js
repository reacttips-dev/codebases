'use es6';

import { List } from 'immutable';
import SearchViewFilterRecord from 'SalesContentIndexUI/data/records/SearchViewFilterRecord';
import filter from 'SalesContentIndexUI/data/utils/filter';
import * as SearchFields from 'SalesContentIndexUI/data/constants/SearchFields';
import * as DefaultFilterNames from 'SalesContentIndexUI/data/lib/DefaultFilterNames';
import DefaultSort from 'SalesContentIndexUI/data/lib/DefaultSort';
export default (function (_ref) {
  var looseItemContentType = _ref.looseItemContentType,
      folderContentType = _ref.folderContentType,
      sort = _ref.sort;
  var filterContentTypeByAll = filter(SearchFields.CONTENT_TYPE_FIELD, looseItemContentType, folderContentType);
  var filterByItemsNotInFolders = filter(SearchFields.FOLDER_ID_FIELD);
  var defaultFilters = List([filterContentTypeByAll, filterByItemsNotInFolders]);

  var isSearchingInFolder = function isSearchingInFolder(filters) {
    var folderFilter = filters.find(function (_ref2) {
      var field = _ref2.field;
      return field === SearchFields.FOLDER_ID_FIELD;
    });
    return folderFilter && !folderFilter.values.isEmpty();
  };

  return SearchViewFilterRecord({
    id: DefaultFilterNames.ALL,
    getFilters: function getFilters() {
      return defaultFilters;
    },
    getSearchQueryOverride: function getSearchQueryOverride(_ref3) {
      var searchQuery = _ref3.searchQuery;
      var query = searchQuery.query,
          filters = searchQuery.filters;

      if (query === '' || isSearchingInFolder(filters)) {
        return searchQuery;
      }

      return searchQuery.set('filters', List([filterContentTypeByAll]));
    },
    getSort: function getSort() {
      return sort || DefaultSort;
    }
  });
});