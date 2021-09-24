'use es6';

import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import { createGetTaskQueuesByIds, createGetTaskQueues, getTaskQueuesByIds, getTaskQueues } from 'reference-resolvers/api/TaskQueuesApi';
export var createTaskQueuesReferenceResolver = function createTaskQueuesReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.TASK_QUEUES,
    createFetchByIds: createGetTaskQueuesByIds,
    createFetchSearchPage: createGetTaskQueues,
    fetchByIds: getTaskQueuesByIds,
    fetchSearchPage: getTaskQueues
  }, options));
};
export default createTaskQueuesReferenceResolver();