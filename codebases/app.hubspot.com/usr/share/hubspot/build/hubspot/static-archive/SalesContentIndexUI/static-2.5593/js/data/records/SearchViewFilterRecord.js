'use es6';

import { List, Record } from 'immutable';
import DefaultSort from 'SalesContentIndexUI/data/lib/DefaultSort';
import * as DefaultFilterNames from 'SalesContentIndexUI/data/lib/DefaultFilterNames';
export default Record({
  id: null,
  getTitle: function getTitle() {
    return '';
  },
  type: DefaultFilterNames.DEFAULT,
  getFilters: function getFilters() {
    return List();
  },
  getSearchQueryOverride: null,
  getSort: function getSort() {
    return DefaultSort;
  },
  getDisabledTooltipCopy: null,
  isDisabled: function isDisabled() {
    return false;
  }
}, 'SearchViewFilterRecord');