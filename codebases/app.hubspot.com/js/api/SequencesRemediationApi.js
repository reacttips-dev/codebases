'use es6';

import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
var BASE_URL = 'sequences/v2/enrollments/impacted';
export var fetchEnrollments = function fetchEnrollments() {
  return apiClient.get(BASE_URL);
};
export var fetchEnrollment = function fetchEnrollment(id) {
  return apiClient.get(BASE_URL + "/" + id + "/reenrollment-preview").then(fromJS);
};
export var updateImpactedEnrollmentStatus = function updateImpactedEnrollmentStatus(id, state) {
  var replacementEnrollmentId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return apiClient.put(BASE_URL + "/" + id + "/state", {
    data: {
      state: state,
      replacementEnrollmentId: replacementEnrollmentId
    }
  }).then(fromJS);
};