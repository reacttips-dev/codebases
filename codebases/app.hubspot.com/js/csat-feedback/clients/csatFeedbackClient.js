'use es6';

import http from 'hub-http/clients/apiClient';
import { logCallingError } from 'calling-error-reporting/report/error';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';
export function requestFn(_ref) {
  var sId = _ref.sId,
      qualityScore = _ref.qualityScore,
      appIdentifier = _ref.appIdentifier;
  var url = "twilio/v1/calls/feedback/" + sId;
  var data = {
    qualityScore: qualityScore,
    sId: sId,
    // The following is data that is needed in the request,
    // but is no longer part of the UI
    issues: [],
    feedback: ''
  };
  return http.post(url, {
    data: data
  }).then(function () {
    CommunicatorLogger.log('communicatorInteraction', {
      action: 'rate call quality',
      activity: 'call',
      channel: 'outbound call',
      callRating: qualityScore,
      source: appIdentifier
    });
  }).catch(function (error) {
    logCallingError({
      errorMessage: 'Saving call feedback failed',
      extraData: {
        error: error,
        qualityScore: qualityScore,
        sId: sId
      },
      tags: {
        requestName: url
      }
    });
    throw error;
  });
}