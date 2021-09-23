import http from 'hub-http/clients/apiClient';
import { initiateLog } from './CallLogAPI';
var TWILIO_URL_PREFIX = 'twilio/v1';

/**
 * V1 route of call my phone
 * This should go away once we figure out what happened to recordings.
 */
export function initiateCall(_ref) {
  var toNumber = _ref.toNumber,
      fromNumber = _ref.fromNumber,
      engagementId = _ref.engagementId,
      recordCall = _ref.recordCall,
      engagement = _ref.engagement,
      callId = _ref.callId,
      source = _ref.source;
  var url = "twilio/v1/calls/callmyphone?source=" + source;
  var payload = {
    contactsNumber: toNumber,
    crmUsersNumber: fromNumber,
    engagementId: engagementId,
    recordCall: recordCall
  };

  if (callId) {
    payload.callId = callId;
  }

  return http.post(url, {
    data: payload
  }).then(function (result) {
    return {
      callmyphone: result,
      createCallResponse: engagement
    };
  });
}
export function startCall(_ref2) {
  var toNumber = _ref2.toNumber,
      fromNumber = _ref2.fromNumber,
      calleeId = _ref2.calleeId,
      calleeObjectTypeId = _ref2.calleeObjectTypeId,
      source = _ref2.source,
      initialIncludeRecording = _ref2.initialIncludeRecording,
      associations = _ref2.associations,
      subscriptionOverride = _ref2.subscriptionOverride,
      accountSid = _ref2.accountSid,
      accountType = _ref2.accountType,
      ownerId = _ref2.ownerId,
      twilioClientOptions = _ref2.twilioClientOptions,
      isUngatedForCallMyPhoneOmnibus = _ref2.isUngatedForCallMyPhoneOmnibus,
      threadId = _ref2.threadId;

  if (!isUngatedForCallMyPhoneOmnibus) {
    return initiateLog({
      toNumber: toNumber,
      fromNumber: fromNumber,
      calleeId: calleeId,
      calleeObjectTypeId: calleeObjectTypeId,
      initialIncludeRecording: initialIncludeRecording,
      subscriptionOverride: subscriptionOverride,
      source: source,
      associations: associations,
      accountSid: accountSid,
      accountType: accountType,
      ownerId: ownerId,
      threadId: threadId
    }).then(function (engagement) {
      return initiateCall({
        toNumber: toNumber,
        fromNumber: fromNumber,
        engagementId: engagement.callCrmObjectId,
        recordCall: twilioClientOptions.recordCall,
        callId: engagement.callId,
        engagement: engagement,
        source: source
      });
    });
  }

  var url = TWILIO_URL_PREFIX + "/calls/crmObjects/create/omnibus/callmyphone";
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
    query: query,
    data: data,
    timeout: 10000
  });
}
export function endCall(_ref3) {
  var callSid = _ref3.callSid,
      engagementId = _ref3.engagementId;
  var url = TWILIO_URL_PREFIX + "/calls/endcallmyphone/" + callSid;
  var query = engagementId ? {
    engagementId: engagementId
  } : {};
  return http.post(url, {
    query: query
  });
}