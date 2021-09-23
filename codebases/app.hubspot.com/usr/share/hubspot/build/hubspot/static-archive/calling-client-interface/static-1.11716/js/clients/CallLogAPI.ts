import http from 'hub-http/clients/apiClient';
import { CALL_META_PROPERTIES } from '../records/engagement/Engagement';
var TWILIO_URL_PREFIX = 'twilio/v1';
export var ENGAGEMENTS_V2_URL_PREFIX = 'engagements/v2/engagements';
export function initiateLog(_ref) {
  var toNumber = _ref.toNumber,
      fromNumber = _ref.fromNumber,
      calleeId = _ref.calleeId,
      calleeObjectTypeId = _ref.calleeObjectTypeId,
      initialIncludeRecording = _ref.initialIncludeRecording,
      subscriptionOverride = _ref.subscriptionOverride,
      source = _ref.source,
      associations = _ref.associations,
      accountSid = _ref.accountSid,
      accountType = _ref.accountType,
      ownerId = _ref.ownerId,
      threadId = _ref.threadId;
  var url = TWILIO_URL_PREFIX + "/calls/crmObjects/create";
  var data = {
    objectsToAssociate: associations,
    callProperties: {
      accountSid: accountSid,
      calleeObjectId: calleeId,
      calleeObjectTypeId: calleeObjectTypeId,
      fromNumber: fromNumber,
      ownerId: ownerId,
      toNumber: toNumber
    }
  };
  var query = {
    isCallMyPhone: false,
    source: source,
    accountType: accountType,
    initialIncludeRecording: initialIncludeRecording,
    subscriptionOverride: subscriptionOverride
  };

  if (threadId) {
    query.threadId = threadId;
  }

  return http.post(url, {
    headers: {
      'X-Source': 'CRM_UI'
    },
    query: query,
    data: data,
    timeout: 10000
  });
}
export function fetchEngagementCallStatusProperties(engagementId) {
  var properties = [CALL_META_PROPERTIES.status, CALL_META_PROPERTIES.durationMilliseconds, CALL_META_PROPERTIES.externalId].join('&properties=');
  var url = ENGAGEMENTS_V2_URL_PREFIX + "/" + engagementId + "?properties=" + properties + "&includeEmailContactHeaders=false&includeScheduledTasks=false";
  return http.get(url);
}