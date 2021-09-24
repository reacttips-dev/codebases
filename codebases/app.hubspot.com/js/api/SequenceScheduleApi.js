'use es6';

import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
export function fetch(query) {
  return apiClient.get("sequences/v2/enrollments/scheduled" + query).then(fromJS);
}
export function updateEnrollment(enrollment) {
  return apiClient.put('sequences/v1/enrollment', {
    data: enrollment.toJS()
  }).then(fromJS);
}