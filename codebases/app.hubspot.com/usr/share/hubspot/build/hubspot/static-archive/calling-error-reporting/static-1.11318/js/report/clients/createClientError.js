'use es6';

import { fromJS } from 'immutable';
import http from 'hub-http/clients/apiClient';
var TWILIO_URL_PREFIX = 'twilio/v1';
export function createClientError(engagementId, errorCode, message, source) {
  var url = TWILIO_URL_PREFIX + "/client-errors/";
  var data = {
    engagementId: engagementId,
    errorCode: errorCode,
    errorMessage: message,
    timestamp: new Date().getTime(),
    issueSource: source
  };
  return http.post(url, {
    data: data,
    timeout: 20000,
    query: {
      clienttimeout: 20000
    }
  }).then(fromJS);
}