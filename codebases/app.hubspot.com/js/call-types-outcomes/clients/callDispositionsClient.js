'use es6';

import apiClient from 'hub-http/clients/apiClient';
export function requestFn() {
  var url = 'twilio/v1/custom-dispositions';
  return apiClient.get(url, {
    query: {
      includeDeleted: false
    }
  });
}