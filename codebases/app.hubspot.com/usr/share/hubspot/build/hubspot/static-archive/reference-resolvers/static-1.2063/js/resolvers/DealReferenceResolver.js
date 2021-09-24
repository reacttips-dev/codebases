'use es6';

import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { DEAL, REVENUE_DEAL_MERGE, EDITABLE_DEAL } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { getObjectsByIds, searchObjects, createGetObjectsByIds, createSearchObjects } from 'reference-resolvers/api/ContactSearchAPI';
export var createDealReferenceResolver = function createDealReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.DEALS,
    createFetchByIds: function createFetchByIds(opts) {
      return createGetObjectsByIds(opts)(DEAL);
    },
    createFetchSearchPage: function createFetchSearchPage(opts) {
      return createSearchObjects(opts)(DEAL);
    },
    fetchByIds: getObjectsByIds(DEAL),
    fetchSearchPage: searchObjects(DEAL)
  }, options));
};
export var RevenueDealMergeReferenceResolver = createDealReferenceResolver({
  cacheKey: CacheKeys.REVENUE_DEAL_MERGES,
  createFetchByIds: function createFetchByIds(opts) {
    return createGetObjectsByIds(opts)(REVENUE_DEAL_MERGE);
  },
  createFetchSearchPage: function createFetchSearchPage(opts) {
    return createSearchObjects(opts)(REVENUE_DEAL_MERGE);
  },
  fetchByIds: getObjectsByIds(REVENUE_DEAL_MERGE),
  fetchSearchPage: searchObjects(REVENUE_DEAL_MERGE)
});
export var EditableDealReferenceResolver = createDealReferenceResolver({
  cacheKey: CacheKeys.EDITABLE_DEALS,
  createFetchByIds: function createFetchByIds(opts) {
    return createGetObjectsByIds(opts)(EDITABLE_DEAL);
  },
  createFetchSearchPage: function createFetchSearchPage(opts) {
    return createSearchObjects(opts)(EDITABLE_DEAL);
  },
  fetchByIds: getObjectsByIds(EDITABLE_DEAL),
  fetchSearchPage: searchObjects(EDITABLE_DEAL)
});
export default createDealReferenceResolver();