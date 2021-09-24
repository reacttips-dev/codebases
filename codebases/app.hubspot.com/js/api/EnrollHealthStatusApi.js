'use es6';

import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
export function fetch() {
  return apiClient.get('sequences/v2/enrollments/health-check').then(fromJS);
}