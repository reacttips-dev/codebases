'use es6';

import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { TICKET } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { getObjectsByIds, searchObjects, createGetObjectsByIds, createSearchObjects } from 'reference-resolvers/api/ContactSearchAPI';
export var createTicketReferenceResolver = function createTicketReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.TICKETS,
    createFetchByIds: function createFetchByIds(opts) {
      return createGetObjectsByIds(opts)(TICKET);
    },
    createFetchSearchPage: function createFetchSearchPage(opts) {
      return createSearchObjects(opts)(TICKET);
    },
    fetchByIds: getObjectsByIds(TICKET),
    fetchSearchPage: searchObjects(TICKET)
  }, options));
};
export default createTicketReferenceResolver();