'use es6';

import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { getEmailCampaignPage, getEmailCampaignsByid, createGetEmailCampaignsByid, createGetEmailCampaignPage } from 'reference-resolvers/api/EmailCampaignAPI';
export var createEmailCampaignReferenceResolver = function createEmailCampaignReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.EMAIL_CAMPAIGNS,
    createFetchByIds: createGetEmailCampaignsByid,
    createFetchSearchPage: createGetEmailCampaignPage,
    fetchByIds: getEmailCampaignsByid,
    fetchSearchPage: getEmailCampaignPage
  }, options));
};
export default createEmailCampaignReferenceResolver();