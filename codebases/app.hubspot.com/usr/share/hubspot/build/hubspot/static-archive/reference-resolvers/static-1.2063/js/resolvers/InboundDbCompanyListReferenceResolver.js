'use es6';

import createSimpleCachedReferenceResolver from 'reference-resolvers/lib/createSimpleCachedReferenceResolver';
import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { createGetAllInboundDbLists, getAllInboundDbLists } from 'reference-resolvers/api/InboundDbListsAPI';
export var createInboundDbCompanyListReferenceResolver = function createInboundDbCompanyListReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.INBOUND_DB_COMPANY_LIST,
    createFetchData: function createFetchData(opts) {
      return createGetAllInboundDbLists(opts)('COMPANY');
    },
    fetchData: getAllInboundDbLists('COMPANY')
  }, options));
};
export default createInboundDbCompanyListReferenceResolver();