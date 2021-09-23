'use es6';

import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import { WORKFLOWS } from 'reference-resolvers/constants/CacheKeys';
import { getWorkflowsByIds, getWorkflowsSearchPage, createGetWorkflowsByIds, createGetWorkflowsSearchPage } from 'reference-resolvers/api/WorkflowsAPI';
export var createWorkflowReferenceResolver = function createWorkflowReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: WORKFLOWS,
    createFetchByIds: createGetWorkflowsByIds,
    createFetchSearchPage: createGetWorkflowsSearchPage,
    fetchByIds: getWorkflowsByIds,
    fetchSearchPage: getWorkflowsSearchPage
  }, options));
};
export default createWorkflowReferenceResolver();