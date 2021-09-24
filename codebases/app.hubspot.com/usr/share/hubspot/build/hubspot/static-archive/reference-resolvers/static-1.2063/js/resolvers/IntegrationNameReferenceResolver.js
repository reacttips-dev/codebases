'use es6';

import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { getIntegrationNameByAppId, createGetIntegrationNameByAppId } from 'reference-resolvers/api/IntegrationsAPI';
export var createIntegrationNameReferenceResolver = function createIntegrationNameReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.INTEGRATION_NAMES,
    createFetchByIds: createGetIntegrationNameByAppId,
    fetchByIds: getIntegrationNameByAppId
  }, options));
};
export default createIntegrationNameReferenceResolver();