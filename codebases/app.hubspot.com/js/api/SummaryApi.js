'use es6';

import Raven from 'Raven';
import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
export function fetchEnrollmentTotals(firstSequenceId) {
  return apiClient.get("sequences/v2/report/" + firstSequenceId + "/enrollments").then(function (response) {
    return fromJS(response);
  }, function (err) {
    if (err.status !== 403) {
      var message = err.status === 0 ? 'timeout' : 'non-timeout';
      Raven.captureMessage("Sequence report summary fetch " + message + " error", {
        extra: {
          statusCode: err.status,
          statusText: err.statusText,
          responseText: err.responseText,
          sequenceId: firstSequenceId
        }
      });
    }

    throw err;
  });
}