'use es6';

import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { fetchCampaignsById, createFetchCampaignsById, createSearchCampaigns, searchCampaigns } from 'reference-resolvers/api/CampaignsAPI';
export var createCampaignReferenceResolver = function createCampaignReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.CAMPAIGNS,
    createFetchByIds: createFetchCampaignsById,
    fetchByIds: fetchCampaignsById,
    createFetchSearchPage: createSearchCampaigns,
    fetchSearchPage: searchCampaigns
  }, options));
};
export default createCampaignReferenceResolver();