'use es6';

import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import { AUTOMATION_PLATFORM_WORKFLOWS } from 'reference-resolvers/constants/CacheKeys';
import { getWorkflowsByIds, getWorkflowsSearchPage, createGetWorkflowsByIds, createGetWorkflowsSearchPage } from 'reference-resolvers/api/AutomationPlatformWorkflowsAPI';
export var createAutomationPlatformWorkflowReferenceResolver = function createAutomationPlatformWorkflowReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: AUTOMATION_PLATFORM_WORKFLOWS,
    createFetchByIds: createGetWorkflowsByIds,
    createFetchSearchPage: createGetWorkflowsSearchPage,
    fetchByIds: getWorkflowsByIds,
    fetchSearchPage: getWorkflowsSearchPage
  }, options));
};
export default createAutomationPlatformWorkflowReferenceResolver();