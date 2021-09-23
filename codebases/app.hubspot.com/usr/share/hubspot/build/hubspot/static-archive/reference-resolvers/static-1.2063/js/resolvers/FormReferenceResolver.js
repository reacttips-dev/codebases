'use es6';

import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { getAllForms, createGetAllForms } from 'reference-resolvers/api/FormsAPI';
import createSimpleCachedReferenceResolver from 'reference-resolvers/lib/createSimpleCachedReferenceResolver';
export var createFormReferenceResolver = function createFormReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.FORMS,
    createFetchData: createGetAllForms,
    fetchData: getAllForms
  }, options));
};
export default createFormReferenceResolver();