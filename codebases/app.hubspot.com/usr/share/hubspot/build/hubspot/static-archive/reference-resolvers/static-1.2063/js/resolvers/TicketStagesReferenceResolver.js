'use es6';

import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { getAllTicketPipelines, createGetAllTicketPipelines } from 'reference-resolvers/api/TicketPipelinesAPI';
import createSimpleCachedReferenceResolver from 'reference-resolvers/lib/createSimpleCachedReferenceResolver';
import get from 'transmute/get';
export var createTicketStagesReferenceResolver = function createTicketStagesReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.TICKET_PIPELINES,
    createFetchData: createGetAllTicketPipelines,
    fetchData: getAllTicketPipelines,
    selectReferences: get('stages')
  }, options));
};
export default createTicketStagesReferenceResolver();