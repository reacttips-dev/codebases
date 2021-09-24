'use es6';

import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import { WORKFLOWS_SALESFORCE } from 'reference-resolvers/constants/CacheKeys';
import { getSalesforceWorkflowsBySearch, getSalesforceWorkflowsByIds, createGetSalesforceWorkflowsByIds, createGetSalesforceWorkflowsBySearch } from 'reference-resolvers/api/SalesforceWorkflowsAPI';
export var createSalesforceWorkflowReferenceResolver = function createSalesforceWorkflowReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: WORKFLOWS_SALESFORCE,
    createFetchByIds: createGetSalesforceWorkflowsByIds,
    createFetchSearchPage: createGetSalesforceWorkflowsBySearch,
    fetchByIds: getSalesforceWorkflowsByIds,
    fetchSearchPage: getSalesforceWorkflowsBySearch
  }, options));
};
export default createSalesforceWorkflowReferenceResolver();