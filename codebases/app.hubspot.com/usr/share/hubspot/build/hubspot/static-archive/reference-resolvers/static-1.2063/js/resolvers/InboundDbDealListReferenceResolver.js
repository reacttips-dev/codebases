'use es6';

import createSimpleCachedReferenceResolver from 'reference-resolvers/lib/createSimpleCachedReferenceResolver';
import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { createGetAllInboundDbLists, getAllInboundDbLists } from 'reference-resolvers/api/InboundDbListsAPI';
export var createInboundDbDealListReferenceResolver = function createInboundDbDealListReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.INBOUND_DB_DEAL_LIST,
    createFetchData: function createFetchData(opts) {
      return createGetAllInboundDbLists(opts)('DEAL');
    },
    fetchData: getAllInboundDbLists('DEAL')
  }, options));
};
export default createInboundDbDealListReferenceResolver();