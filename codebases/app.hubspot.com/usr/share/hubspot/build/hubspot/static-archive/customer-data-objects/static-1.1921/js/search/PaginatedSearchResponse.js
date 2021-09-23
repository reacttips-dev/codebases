'use es6';

import { fromJS, Map as ImmutableMap, Record, Seq } from 'immutable';
import invariant from 'react-utils/invariant';
import isFunction from 'transmute/isFunction';
import isInstanceOf from 'transmute/isInstanceOf';
import isObject from 'transmute/isObject';
import PaginatedSearchResult from './PaginatedSearchResult';
import get from 'transmute/get';

function _enforceFunction(name, value) {
  invariant(isFunction(value), 'expected `%s` to be a function but got `%s`', name, value);
  return value;
}

var PaginatedSearchResponse = Record({
  objects: ImmutableMap(),
  searchResult: PaginatedSearchResult()
}, 'PaginatedSearchResponse');
var defaultGetHasMore = get('has-more');
var defaultGetOffset = get('offset');
var defaultGetTotal = get('total');
/**
 * Creates a PaginatedSearchResponse from the JSON structure returned by hubspot
 * elastic search endpoints.
 *
 * @param {(response: Object) => Array<Object>} options.getObjects
 * @param {(object: Object) => string} options.getObjectId
 * @param {?Function} options.objectFromJS
 * @return {(response: Object) => PaginatedSearchResponse}
 */

PaginatedSearchResponse.fromElasticSearch = function (_ref) {
  var _ref$getHasMore = _ref.getHasMore,
      getHasMore = _ref$getHasMore === void 0 ? defaultGetHasMore : _ref$getHasMore,
      _ref$getOffset = _ref.getOffset,
      getOffset = _ref$getOffset === void 0 ? defaultGetOffset : _ref$getOffset,
      _ref$getTotal = _ref.getTotal,
      getTotal = _ref$getTotal === void 0 ? defaultGetTotal : _ref$getTotal,
      getObjects = _ref.getObjects,
      getObjectId = _ref.getObjectId,
      _ref$objectFromJS = _ref.objectFromJS,
      objectFromJS = _ref$objectFromJS === void 0 ? fromJS : _ref$objectFromJS;

  _enforceFunction('getObjects', getObjects);

  _enforceFunction('getObjectId', getObjectId);

  _enforceFunction('objectFromJS', objectFromJS);

  return function (query) {
    return function (response) {
      if (!response) {
        return response;
      }

      var objects = getObjects(response);
      return PaginatedSearchResponse({
        objects: objects.reduce(function (acc, object) {
          return acc.set("" + getObjectId(object), objectFromJS(object));
        }, ImmutableMap()),
        searchResult: PaginatedSearchResult({
          query: query,
          results: Seq(objects).map(getObjectId).toList(),
          hasMore: getHasMore(response),
          offset: getOffset(response),
          total: getTotal(response)
        })
      });
    };
  };
};

PaginatedSearchResponse.fromJS = function (json) {
  if (!isObject(json)) {
    return json;
  }

  return PaginatedSearchResponse({
    objects: fromJS(json.objects) || ImmutableMap(),
    searchResult: PaginatedSearchResult.fromJS(json.searchResult)
  });
};

PaginatedSearchResponse.isPaginatedSearchResponse = isInstanceOf(PaginatedSearchResponse);
export default PaginatedSearchResponse;