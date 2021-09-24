'use es6';

import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import createBatchedReferenceResolver from '../lib/createBatchedReferenceResolver';
import { createGetFormsByIds, createSearchForms, getFormsByIds, searchForms } from 'reference-resolvers/api/FormsAPI';
export var createFormBatchedReferenceResolver = function createFormBatchedReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.FORMS,
    createFetchByIds: createGetFormsByIds,
    createFetchSearchPage: createSearchForms,
    fetchByIds: getFormsByIds,
    fetchSearchPage: searchForms
  }, options));
};
export default createFormBatchedReferenceResolver();