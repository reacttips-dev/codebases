'use es6';

import http from 'hub-http/clients/apiClient';
export function toggleRecording(_ref) {
  var engagementId = _ref.engagementId,
      shouldRecord = _ref.shouldRecord,
      callSid = _ref.callSid;
  var url = "twilio/v1/recordings/includerecording/" + engagementId;
  return http.put(url, {
    query: {
      shouldRecord: shouldRecord,
      callSid: callSid
    }
  });
}