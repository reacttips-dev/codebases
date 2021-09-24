'use es6';

import links from 'crm-legacy-links/links';
import { Map as ImmutableMap } from 'immutable';
import merge from 'transmute/merge';
export default (function () {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var queryParams = ImmutableMap(links.getQueryParams());
  var newParams = merge(ImmutableMap(params), queryParams).filter(function (value) {
    return value !== '';
  }) // Put query last if it's in the map
  .sortBy(function (value, key) {
    return key === 'query';
  });
  return links.toQueryString(newParams.toObject());
});