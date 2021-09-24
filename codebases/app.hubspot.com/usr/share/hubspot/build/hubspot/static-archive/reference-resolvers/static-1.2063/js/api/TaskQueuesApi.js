'use es6';

import http from 'hub-http/clients/apiClient';
import { formatTaskQueuesReferenceList, formatTaskQueuesSearchResponse } from '../formatters/formatTaskQueues';
export var createGetTaskQueues = function createGetTaskQueues(_ref) {
  var httpClient = _ref.httpClient;
  return function () {
    return httpClient.get('engagements/v1/queues/owner/current', {
      query: {
        includeShared: true,
        includeEngagements: false
      }
    }).then(formatTaskQueuesSearchResponse);
  };
};
export var getTaskQueues = createGetTaskQueues({
  httpClient: http
});
export var createGetTaskQueuesByIds = function createGetTaskQueuesByIds(_ref2) {
  var httpClient = _ref2.httpClient;
  return function (queueIdsArray) {
    return httpClient.get('engagements/v1/queues/batch', {
      query: {
        queueId: queueIdsArray,
        includeEngagements: false
      }
    }).then(formatTaskQueuesReferenceList);
  };
};
export var getTaskQueuesByIds = createGetTaskQueuesByIds({
  httpClient: http
});