'use es6';

import httpClient from 'hub-http/clients/apiClient';
import { fromJS } from 'immutable';
var BASE_URI = '/video/v1/video-migration/status';
export var fetchVideo2MigrationDataStatus = function fetchVideo2MigrationDataStatus() {
  return httpClient.get(BASE_URI).then(fromJS);
};
export var updateVideoMigrationUserStatus = function updateVideoMigrationUserStatus(status) {
  return httpClient.post(BASE_URI, {
    query: {
      status: status
    }
  }).then(fromJS);
};