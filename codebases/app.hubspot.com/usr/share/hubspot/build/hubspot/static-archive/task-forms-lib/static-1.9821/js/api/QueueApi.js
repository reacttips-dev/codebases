'use es6';

import apiClient from 'hub-http/clients/apiClient';
export function postQueue(ownerId, queueName) {
  return apiClient.post('engagements/v1/queues', {
    data: {
      ownerId: ownerId,
      name: queueName
    }
  });
}