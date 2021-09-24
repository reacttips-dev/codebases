'use es6';

import http from 'hub-http/clients/apiClient';
import { TASK_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { logCallingError } from 'calling-error-reporting/report/error';
export function requestFn(_ref) {
  var engagement = _ref.engagement;
  var url = 'engagements/v2/engagements';
  return http.post(url, {
    data: engagement
  }).catch(function (error) {
    logCallingError({
      errorMessage: 'Saving follow up task failed',
      extraData: {
        error: error
      },
      tags: {
        requestName: url
      }
    });
    throw error;
  });
}
export function fetchAllAssociationDefinitions() {
  return http.get("associations/v1/definitions/from-object-types?objectTypeId=" + TASK_TYPE_ID);
}