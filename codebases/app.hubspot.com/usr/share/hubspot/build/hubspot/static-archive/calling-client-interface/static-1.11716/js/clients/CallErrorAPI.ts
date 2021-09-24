import { fromJS } from 'immutable';
import http from 'hub-http/clients/apiClient';
/**
 * See:
 * https://tools.hubteam.com/api-catalog/services/TwilioService/v1/spec/internal#operations-Notifications-get-%2Ftwilio%2Fv1%2Fnotifications%2Fcall%2F%7BcallSid%7D
 */

export function getFailedCallErrorCode(callSid) {
  var url = "twilio/v1/notifications/call/" + callSid;
  return http.get(url).then(fromJS);
}