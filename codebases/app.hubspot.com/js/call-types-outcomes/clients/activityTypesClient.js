'use es6';

import apiClient from 'hub-http/clients/apiClient';
export function requestFn() {
  var url = 'engagements/v1/activity-types';
  return apiClient.get(url);
}