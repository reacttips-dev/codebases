'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, Record } from 'immutable';
import TableRowLimit from 'SalesContentIndexUI/constants/TableRowLimit';
import SearchSortRecord from 'SalesContentIndexUI/data/records/SearchSortRecord';
import { FOLDER_ID_FIELD } from 'SalesContentIndexUI/data/constants/SearchFields';
import filter from 'SalesContentIndexUI/data/utils/filter';
var SearchQueryBaseRecord = Record({
  query: '',
  limit: 25,
  offset: 0,
  filters: List(),
  sorts: List(),
  contentTypesToHydrate: List()
}, 'SearchQueryRecord');

var SearchQueryRecord = /*#__PURE__*/function (_SearchQueryBaseRecor) {
  _inherits(SearchQueryRecord, _SearchQueryBaseRecor);

  function SearchQueryRecord() {
    _classCallCheck(this, SearchQueryRecord);

    return _possibleConstructorReturn(this, _getPrototypeOf(SearchQueryRecord).apply(this, arguments));
  }

  _createClass(SearchQueryRecord, [{
    key: "getCurrentPage",
    value: function getCurrentPage() {
      return Math.floor(this.offset / this.limit + 1);
    }
  }, {
    key: "getFolderFilter",
    value: function getFolderFilter() {
      return this.filters.find(function (searchFilterRecord) {
        return searchFilterRecord.field === FOLDER_ID_FIELD;
      });
    }
  }, {
    key: "setFolderFilter",
    value: function setFolderFilter(folderId) {
      var folderFilter = folderId ? filter(FOLDER_ID_FIELD, folderId) : filter(FOLDER_ID_FIELD);
      var hasFolderFilter = !!this.getFolderFilter();
      var updatedFilters;

      if (!hasFolderFilter) {
        updatedFilters = this.filters.push(folderFilter);
      } else {
        updatedFilters = this.filters.map(function (searchFilterRecord) {
          if (searchFilterRecord.field !== FOLDER_ID_FIELD) {
            return searchFilterRecord;
          }

          return folderId ? filter(FOLDER_ID_FIELD, folderId) : filter(FOLDER_ID_FIELD);
        });
      }

      return this.merge({
        query: '',
        filters: updatedFilters
      });
    }
  }, {
    key: "mergeWithQueryParams",
    value: function mergeWithQueryParams(_ref) {
      var queryParams = _ref.queryParams,
          selectedViewFilter = _ref.selectedViewFilter;
      var _queryParams$q = queryParams.q,
          q = _queryParams$q === void 0 ? '' : _queryParams$q,
          folder = queryParams.folder,
          field = queryParams.field,
          order = queryParams.order,
          _queryParams$page = queryParams.page,
          page = _queryParams$page === void 0 ? 1 : _queryParams$page,
          id = queryParams.id;
      var updatedSort = field && order ? List([SearchSortRecord({
        field: field,
        order: order
      })]) : this.sorts;
      var updatedOffset = (page - 1) * TableRowLimit.INDEX;
      var updatedSearchQuery = this.merge({
        query: q,
        filters: selectedViewFilter.getFilters(id),
        sorts: updatedSort,
        offset: updatedOffset
      });
      return folder ? updatedSearchQuery.setFolderFilter(folder) : updatedSearchQuery;
    }
  }]);

  return SearchQueryRecord;
}(SearchQueryBaseRecord);

export { SearchQueryRecord as default };