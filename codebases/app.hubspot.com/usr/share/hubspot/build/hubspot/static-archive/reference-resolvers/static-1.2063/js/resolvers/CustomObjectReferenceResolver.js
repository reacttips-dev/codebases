'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { createFetchByIds as _createFetchByIds, fetchByIds } from 'reference-resolvers/api/CrmObjectsAPI';
import { createFetchSearchPage as _createFetchSearchPage, fetchSearchPage } from 'reference-resolvers/api/CrmSearchAPI';
import { CUSTOM_OBJECT } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { getDefaultGettersByObjectTypeId } from 'reference-resolvers/formatters/formatCustomObjects';
import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import memoize from 'transmute/memoize';
var createCustomObjectKey = memoize(function (key, objectTypeId) {
  return key + "_" + objectTypeId;
});
export var toCustomReferenceObjectType = function toCustomReferenceObjectType(objectTypeId) {
  return createCustomObjectKey(CUSTOM_OBJECT, objectTypeId);
};
export var getFormatterOptions = function getFormatterOptions(objectTypeId) {
  var formatterOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Object.assign({}, formatterOptions, {
    getters: Object.assign({}, getDefaultGettersByObjectTypeId(objectTypeId), {}, formatterOptions.getters)
  });
};
export var createCustomObjectReferenceResolver = function createCustomObjectReferenceResolver(objectTypeId) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      resolverOptions = _ref.resolverOptions,
      fetchQueryParams = _ref.fetchQueryParams,
      searchOptions = _ref.searchOptions,
      searchQueryParams = _ref.searchQueryParams,
      options = _ref.formatterOptions;

  var formatterOptions = getFormatterOptions(objectTypeId, options);
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: createCustomObjectKey(CacheKeys.CUSTOM_OBJECT, objectTypeId),
    maxBatchSize: 200,
    createFetchByIds: function createFetchByIds(opts) {
      return _createFetchByIds(Object.assign({}, opts))(objectTypeId, {
        fetchQueryParams: fetchQueryParams,
        formatterOptions: formatterOptions
      });
    },
    createFetchSearchPage: function createFetchSearchPage(opts) {
      return _createFetchSearchPage(opts)(objectTypeId, {
        searchOptions: searchOptions,
        searchQueryParams: searchQueryParams,
        formatterOptions: formatterOptions
      });
    },
    fetchByIds: fetchByIds(objectTypeId, {
      fetchQueryParams: fetchQueryParams,
      formatterOptions: formatterOptions
    }),
    fetchSearchPage: fetchSearchPage(objectTypeId, {
      searchOptions: searchOptions,
      searchQueryParams: searchQueryParams,
      formatterOptions: formatterOptions
    })
  }, resolverOptions));
};
export default (function (objectTypeId, options) {
  var __ro = options.resolverOptions,
      opts = _objectWithoutProperties(options, ["resolverOptions"]);

  return createCustomObjectReferenceResolver(objectTypeId, opts);
});