'use es6';

import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { getAllPersonas, createGetAllPersonas } from 'reference-resolvers/api/PersonasAPI';
import createSimpleCachedReferenceResolver from 'reference-resolvers/lib/createSimpleCachedReferenceResolver';
export var createPersonaReferenceResolver = function createPersonaReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.PERSONAS,
    createFetchData: createGetAllPersonas,
    fetchData: getAllPersonas
  }, options));
};
export default createPersonaReferenceResolver();