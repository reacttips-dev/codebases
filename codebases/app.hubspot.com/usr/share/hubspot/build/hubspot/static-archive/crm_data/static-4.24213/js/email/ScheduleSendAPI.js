'use es6';

import { fromJS } from 'immutable';
import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import EngagementRecord from 'customer-data-objects/engagement/EngagementRecord';
import { PUT } from 'crm_data/constants/HTTPVerbs';
import partial from 'transmute/partial';
import { getEmailApiErrorLangKey, getEmailApiAlertOptions } from 'customer-data-email/utils/EmailAPIErrorMessages';
import { EMAIL_SEND_ERROR } from 'customer-data-email/constants/EmailAPIErrorTypes';
import IsUngatedStore from 'crm_data/gates/IsUngatedStore';

var handleSendError = function handleSendError(emailRecord, error) {
  var sendError = error || {};
  var defaultMessage = getEmailApiErrorLangKey(EMAIL_SEND_ERROR);
  var errorJSON = fromJS(sendError.responseJSON);
  var errorType = errorJSON.getIn(['emailEngagementCreatorFailure', 'emailEngagementCreatorFailureType']) || errorJSON.get('sendSchedulingFailureType');
  var alertOptions = getEmailApiAlertOptions({
    errorType: errorType,
    defaultMessage: defaultMessage,
    emailRecord: emailRecord,
    isUngatedForEmailSettingsMigration: IsUngatedStore.get('EmailSettingsMigration')
  });
  return Promise.reject(alertOptions);
};

export function schedule(emailRecord, scheduledTime, associations, _ref, replyToEngagementId, recommendedSendTimeId) {
  var source = _ref.source;
  var query = associations.delete('contactIds').toJS();
  var API = "engagements-emails/v1/email/schedule-send";

  if (replyToEngagementId) {
    query.replyToEngagementId = replyToEngagementId;
  }

  if (recommendedSendTimeId) {
    query.recommendedSendTimeId = recommendedSendTimeId;
  }

  return ImmutableAPI.send({
    type: PUT,
    headers: {
      'X-Source': source
    },
    query: query
  }, API + "?scheduledTime=" + scheduledTime, emailRecord).then(function (result) {
    return result && EngagementRecord.fromJS(result);
  }, partial(handleSendError, emailRecord));
}
export function deleteAndUnscheduleEmail(senderEmail, facsimileSendId) {
  return ImmutableAPI.put("engagements-emails/v1/email/unschedule-send/" + encodeURIComponent(senderEmail) + "/" + facsimileSendId);
}