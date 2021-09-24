'use es6';

import { Map as ImmutableMap, fromJS } from 'immutable';
import partial from 'transmute/partial';
import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import PortalIdParser from 'PortalIdParser';
import EngagementRecord from 'customer-data-objects/engagement/EngagementRecord';
import EmailRecipientDeliverabilityRecord from 'customer-data-email/schema/email/EmailRecipientDeliverabilityRecord';
import { PUT, POST } from 'crm_data/constants/HTTPVerbs';
import { getEmailApiErrorLangKey, getEmailApiAlertOptions } from 'customer-data-email/utils/EmailAPIErrorMessages';
import { EMAIL_SEND_ERROR } from 'customer-data-email/constants/EmailAPIErrorTypes';
import { logError } from 'customer-data-ui-utilities/eventLogging/eventLogger';
import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
var URLS = {
  send: 'engagements-emails/v1/email/send',
  sendUsingHubSpot: 'conversations-email/v1/send/crm',
  deliverability: function deliverability(emailAddress) {
    return "email/v1/contacts/" + encodeURIComponent(emailAddress) + "/subscriptions/predict-drop";
  }
};

var getDeliverabilityPayload = function getDeliverabilityPayload(appId) {
  return ImmutableMap({
    is_transactional: true,
    portal_id: PortalIdParser.get(),
    app_id: appId
  });
};

var toEmailRecipientDeliverabilityRecord = function toEmailRecipientDeliverabilityRecord(emailAddress, response) {
  return EmailRecipientDeliverabilityRecord(response).set('address', emailAddress);
};

var handleSendError = function handleSendError(emailRecord, error) {
  var sendError = error || {};
  var defaultMessage = getEmailApiErrorLangKey(EMAIL_SEND_ERROR);
  var errorJSON = fromJS(sendError.responseJSON || {});
  var errorType = errorJSON.has('@error') ? errorJSON.get('@error') // v2 response error key
  : errorJSON.get('errorType'); // v1 response error key

  var alertOptions = getEmailApiAlertOptions({
    errorType: errorType,
    defaultMessage: defaultMessage,
    emailRecord: emailRecord,
    isUngatedForEmailSettingsMigration: IsUngatedStore.get('EmailSettingsMigration')
  });
  logError({
    error: new Error('Email send failed'),
    extraData: {
      error: errorJSON
    },
    tags: {
      communicatorType: 'EMAIL'
    }
  });
  return Promise.reject(alertOptions);
};

export function fetchDeliverabilityStatus(emailAddress, _ref) {
  var appId = _ref.appId;

  if (!appId || !emailAddress) {
    var fieldName = emailAddress ? 'appId' : 'emailAddress';
    return Promise.reject({
      message: fieldName + " is null."
    });
  }

  var handleResponse = partial(toEmailRecipientDeliverabilityRecord, emailAddress);
  return ImmutableAPI.put(URLS.deliverability(emailAddress), getDeliverabilityPayload(appId)).then(handleResponse, function (e) {
    return Promise.reject(e);
  });
}
export function send(emailRecord, associations, _ref2) {
  var source = _ref2.source;
  var query = associations.toJS();
  return ImmutableAPI.send({
    type: PUT,
    headers: {
      'X-Source': source
    },
    query: query
  }, URLS.send, emailRecord).then(function (result) {
    return result && EngagementRecord.fromJS(result);
  }, partial(handleSendError, emailRecord));
}
export function sendUsingHubSpot(emailRecord, _ref3) {
  var source = _ref3.source;
  return ImmutableAPI.send({
    type: POST,
    headers: {
      'X-Source': source
    }
  }, URLS.sendUsingHubSpot, emailRecord).then(EngagementRecord.fromJS, partial(handleSendError, emailRecord));
}
export function reply(emailRecord, associations, replyToEngagementId, _ref4) {
  var source = _ref4.source;
  var query = associations.toJS();
  query.replyToEngagementId = replyToEngagementId;
  return ImmutableAPI.send({
    type: PUT,
    headers: {
      'X-Source': source
    },
    query: query
  }, URLS.send, emailRecord).then(EngagementRecord.fromJS, partial(handleSendError, emailRecord));
}