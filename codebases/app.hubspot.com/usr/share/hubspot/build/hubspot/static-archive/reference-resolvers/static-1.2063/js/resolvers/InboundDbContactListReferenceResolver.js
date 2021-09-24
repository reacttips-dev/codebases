'use es6';

import createSimpleCachedReferenceResolver from 'reference-resolvers/lib/createSimpleCachedReferenceResolver';
import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { createGetAllInboundDbLists, getAllInboundDbLists } from 'reference-resolvers/api/InboundDbListsAPI';
export var createInboundDbContactListReferenceResolver = function createInboundDbContactListReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.INBOUND_DB_CONTACT_LIST,
    createFetchData: function createFetchData(opts) {
      return createGetAllInboundDbLists(opts)('CONTACT');
    },
    fetchData: getAllInboundDbLists('CONTACT')
  }, options));
};
export default createInboundDbContactListReferenceResolver();