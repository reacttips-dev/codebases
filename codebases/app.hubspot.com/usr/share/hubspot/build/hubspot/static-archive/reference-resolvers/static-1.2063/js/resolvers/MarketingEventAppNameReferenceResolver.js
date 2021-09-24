'use es6';

import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import createSimpleCachedReferenceResolver from 'reference-resolvers/lib/createSimpleCachedReferenceResolver';
import { createGetAllMarketingEventAppNames, getAllMarketingEventAppNames } from '../api/MarketingEventAppNameApi';
export var createMarketingEventAppNameReferenceResolver = function createMarketingEventAppNameReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.MARKETING_EVENT_APP_NAMES,
    createFetchData: createGetAllMarketingEventAppNames,
    fetchData: getAllMarketingEventAppNames
  }, options));
};
export default createMarketingEventAppNameReferenceResolver();