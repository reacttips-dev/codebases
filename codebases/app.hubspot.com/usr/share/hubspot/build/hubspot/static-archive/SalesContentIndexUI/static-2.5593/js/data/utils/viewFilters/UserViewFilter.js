'use es6';

import { List } from 'immutable';
import SearchViewFilterRecord from 'SalesContentIndexUI/data/records/SearchViewFilterRecord';
import filter from 'SalesContentIndexUI/data/utils/filter';
import * as SearchFields from 'SalesContentIndexUI/data/constants/SearchFields';
import * as DefaultFilterNames from 'SalesContentIndexUI/data/lib/DefaultFilterNames';
import DefaultSort from 'SalesContentIndexUI/data/lib/DefaultSort';
export var MyUserViewFilter = function MyUserViewFilter(_ref) {
  var looseItemContentType = _ref.looseItemContentType,
      getUserId = _ref.getUserId,
      sort = _ref.sort,
      useOwnerViewFilters = _ref.useOwnerViewFilters;
  var filterContentTypeByLooseItems = filter(SearchFields.CONTENT_TYPE_FIELD, looseItemContentType);
  return SearchViewFilterRecord({
    id: useOwnerViewFilters ? DefaultFilterNames.OWNED_BY_ME : DefaultFilterNames.CREATED_BY_ME,
    getFilters: function getFilters() {
      return List([filterContentTypeByLooseItems, filter(SearchFields.USER_ID_FIELD, getUserId())]);
    },
    getSort: function getSort() {
      return sort || DefaultSort;
    }
  });
};
export var UserViewFilter = function UserViewFilter(_ref2) {
  var looseItemContentType = _ref2.looseItemContentType,
      sort = _ref2.sort,
      id = _ref2.id;
  var filterContentTypeByLooseItems = filter(SearchFields.CONTENT_TYPE_FIELD, looseItemContentType);
  return SearchViewFilterRecord({
    id: DefaultFilterNames.USER + "-" + id,
    type: DefaultFilterNames.USER,
    getFilters: function getFilters() {
      return List([filterContentTypeByLooseItems, filter(SearchFields.USER_ID_FIELD, id)]);
    },
    getSort: function getSort() {
      return sort || DefaultSort;
    }
  });
};