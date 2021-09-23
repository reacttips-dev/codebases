'use es6';

import { fromJS } from 'immutable';
import http from 'hub-http/clients/apiClient';
var BASE_URI = 'filemanager/api/v3/limits';
export function fetchLimits() {
  return http.get(BASE_URI).then(fromJS);
}