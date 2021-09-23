'use es6';

import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import createSimpleCachedReferenceResolver from 'reference-resolvers/lib/createSimpleCachedReferenceResolver';
import { getAllDispositionTypes, createGetAllDispositionTypes } from 'reference-resolvers/api/CallDispositionsAPI';
export var createCallDispositionReferenceResolver = function createCallDispositionReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.CALL_DISPOSITIONS,
    createFetchData: createGetAllDispositionTypes,
    fetchData: getAllDispositionTypes
  }, options));
};
export default createCallDispositionReferenceResolver();