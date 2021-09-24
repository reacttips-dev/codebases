'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { OrderedMap, List } from 'immutable';
import I18n from 'I18n';
import SearchViewFilterRecord from 'SalesContentIndexUI/data/records/SearchViewFilterRecord';
import filter from 'SalesContentIndexUI/data/utils/filter';
import sort from 'SalesContentIndexUI/data/utils/sort';
import { CONTENT_TYPE_FIELD, LAST_USED_AT_FIELD } from 'SalesContentIndexUI/data/constants/SearchFields';
import SortValues from 'SalesContentIndexUI/data/constants/SortValues';
var RECENT_FILTER = 'recent';
export default (function (_ref) {
  var looseItemContentType = _ref.looseItemContentType;
  var filterContentTypeByLooseItems = filter(CONTENT_TYPE_FIELD, looseItemContentType);
  var RecentViewFilter = SearchViewFilterRecord({
    id: RECENT_FILTER,
    getTitle: function getTitle() {
      return I18n.text("selectTable.recent.title");
    },
    getFilters: function getFilters() {
      return List([filterContentTypeByLooseItems]);
    },
    getSort: function getSort() {
      return sort(LAST_USED_AT_FIELD, SortValues.DESC);
    }
  });
  return OrderedMap(_defineProperty({}, RECENT_FILTER, RecentViewFilter));
});