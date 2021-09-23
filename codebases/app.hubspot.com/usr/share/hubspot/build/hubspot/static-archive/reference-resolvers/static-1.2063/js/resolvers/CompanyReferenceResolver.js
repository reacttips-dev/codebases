'use es6';

import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { COMPANY } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { createGetObjectsByIds, createSearchObjects, getObjectsByIds, searchObjects } from 'reference-resolvers/api/ContactSearchAPI';
export var createCompanyReferenceResolver = function createCompanyReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.COMPANIES,
    createFetchByIds: function createFetchByIds(opts) {
      return createGetObjectsByIds(opts)(COMPANY);
    },
    createFetchSearchPage: function createFetchSearchPage(opts) {
      return createSearchObjects(opts)(COMPANY);
    },
    fetchByIds: getObjectsByIds(COMPANY),
    fetchSearchPage: searchObjects(COMPANY)
  }, options));
};
export default createCompanyReferenceResolver();