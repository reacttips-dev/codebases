'use es6';

import { List } from 'immutable';
import filter from 'SalesContentIndexUI/data/utils/filter';
import { CONTENT_TYPE_FIELD } from 'SalesContentIndexUI/data/constants/SearchFields';
export default (function (looseItemContentType) {
  var filterContentTypeByLooseItems = filter(CONTENT_TYPE_FIELD, looseItemContentType);
  return List([filterContentTypeByLooseItems]);
});