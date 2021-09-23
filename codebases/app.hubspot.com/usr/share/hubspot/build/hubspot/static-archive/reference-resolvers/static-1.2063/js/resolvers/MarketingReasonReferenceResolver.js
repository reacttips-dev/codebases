'use es6';

import { MARKETING_REASONS } from 'reference-resolvers/constants/CacheKeys';
import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import { createGetMarketingReasonById, getMarketingReasonById } from '../api/MarketingContactsAPI';
export var createMarketingReasonReferenceResolver = function createMarketingReasonReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: MARKETING_REASONS,
    createFetchByIds: createGetMarketingReasonById,
    fetchByIds: getMarketingReasonById
  }, options));
};
export default createMarketingReasonReferenceResolver();