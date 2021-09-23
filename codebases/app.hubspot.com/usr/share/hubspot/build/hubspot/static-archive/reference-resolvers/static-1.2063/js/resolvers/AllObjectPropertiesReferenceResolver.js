'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { ALL_OBJECT_PROPERTIES as ALL_OBJECT_PROPERTIES_CACHE_KEY } from 'reference-resolvers/constants/CacheKeys';
import { ALL_OBJECT_PROPERTIES } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { createCustomKey } from 'reference-resolvers/lib/CustomKey';
import createSimpleCachedReferenceResolver from 'reference-resolvers/lib/createSimpleCachedReferenceResolver';
import { createGetAllProperties, getAllProperties } from 'reference-resolvers/api/PropertiesAPI';
export var toAllObjectPropertiesReferenceObjectType = function toAllObjectPropertiesReferenceObjectType(objectTypeId) {
  return createCustomKey(ALL_OBJECT_PROPERTIES, objectTypeId);
};
export var createAllObjectPropertiesReferenceResolver = function createAllObjectPropertiesReferenceResolver(objectTypeId) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      resolverOptions = _ref.resolverOptions,
      fetchQueryParams = _ref.fetchQueryParams;

  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: createCustomKey(ALL_OBJECT_PROPERTIES_CACHE_KEY, objectTypeId),
    createFetchData: function createFetchData(opts) {
      return createGetAllProperties(opts)(objectTypeId, {
        queryParams: fetchQueryParams
      });
    },
    fetchData: getAllProperties(objectTypeId, {
      queryParams: fetchQueryParams
    })
  }, resolverOptions));
};
export default (function (objectTypeId, options) {
  var __ro = options.resolverOptions,
      opts = _objectWithoutProperties(options, ["resolverOptions"]);

  return createAllObjectPropertiesReferenceResolver(objectTypeId, opts);
});