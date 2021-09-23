'use es6';

import createSimpleCachedReferenceResolver from 'reference-resolvers/lib/createSimpleCachedReferenceResolver';
import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { createGetAllInboundDbLists, getAllInboundDbLists } from 'reference-resolvers/api/InboundDbListsAPI';
export var createInboundDbTicketListReferenceResolver = function createInboundDbTicketListReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.INBOUND_DB_TICKET_LIST,
    createFetchData: function createFetchData(opts) {
      return createGetAllInboundDbLists(opts)('TICKET');
    },
    fetchData: getAllInboundDbLists('TICKET')
  }, options));
};
export default createInboundDbTicketListReferenceResolver();