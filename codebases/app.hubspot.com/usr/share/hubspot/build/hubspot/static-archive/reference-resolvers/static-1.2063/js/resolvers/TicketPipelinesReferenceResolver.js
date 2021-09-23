'use es6';

import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { getAllTicketPipelines, createGetAllTicketPipelines } from 'reference-resolvers/api/TicketPipelinesAPI';
import createSimpleCachedReferenceResolver from 'reference-resolvers/lib/createSimpleCachedReferenceResolver';
import get from 'transmute/get';
export var createTicketPipelinesReferenceResolver = function createTicketPipelinesReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.TICKET_PIPELINES,
    createFetchData: createGetAllTicketPipelines,
    fetchData: getAllTicketPipelines,
    selectReferences: get('pipelines')
  }, options));
};
export default createTicketPipelinesReferenceResolver();