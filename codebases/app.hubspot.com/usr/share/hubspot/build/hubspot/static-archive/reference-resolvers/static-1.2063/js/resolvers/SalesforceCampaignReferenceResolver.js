'use es6';

import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import { getSalesforceCampaignsById, getSalesforceCampaignsBySearch, createGetSalesforceCampaignsById, createGetSalesforceCampaignsBySearch } from 'reference-resolvers/api/SalesforceCampaignsAPI';
export var createSalesforceCampaignReferenceResolver = function createSalesforceCampaignReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.SALESFORCE_CAMPAIGNS,
    createFetchByIds: createGetSalesforceCampaignsById,
    createFetchSearchPage: createGetSalesforceCampaignsBySearch,
    fetchByIds: getSalesforceCampaignsById,
    fetchSearchPage: getSalesforceCampaignsBySearch
  }, options));
};
export default createSalesforceCampaignReferenceResolver();