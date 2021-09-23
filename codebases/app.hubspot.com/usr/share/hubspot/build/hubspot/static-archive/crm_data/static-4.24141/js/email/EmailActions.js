'use es6';

import partial from 'transmute/partial';
import { dispatch } from 'crm_data/flux/dispatch';
import { EMAIL_RECIPIENT_DELIVERABILTY_FETCH_SUCCEEDED, EMAIL_LAWFUL_BASIS_ADDED, EMAIL_LAWFUL_BASIS_COMPLETE } from '../actions/ActionTypes';
import { fetchDeliverabilityStatus, send, sendUsingHubSpot, reply } from './EmailAPI';
import { performBulkUpdateDoubleOptInStatus } from './EmailSubscriptionAPI';
import { provideLegalBasis } from './GDPRLegalBasisAPI';
import { schedule } from './ScheduleSendAPI';
import { dispatchSafe } from '../dispatch/Dispatch';

var handleSendSuccess = function handleSendSuccess(email, engagement) {
  return {
    email: email,
    engagement: engagement
  };
};

export function fetchEmailRecipientDeliverabilityStatus(emailAddress, options) {
  fetchDeliverabilityStatus(emailAddress, options).then(function (resp) {
    return dispatch(EMAIL_RECIPIENT_DELIVERABILTY_FETCH_SUCCEEDED, resp);
  }).done();
}
export function sendEmail(email, associations, options) {
  return send(email, associations, options).then(partial(handleSendSuccess, email));
}
export function sendEmailUsingHubSpot(email, options) {
  return sendUsingHubSpot(email, options).then(partial(handleSendSuccess, email));
}
export function sendReplyEmail(email, associations, replyToEngagementId, options) {
  return reply(email, associations, replyToEngagementId, options).then(partial(handleSendSuccess, email));
}
export function scheduleEmail(email, scheduledTime, associations, options, replyEngagementId, recommendedSendTimeId) {
  return schedule(email, scheduledTime, associations, options, replyEngagementId, recommendedSendTimeId).then(partial(handleSendSuccess, email));
}
export function provideLegalBasisForCommunication(data) {
  return provideLegalBasis(data);
}
export function updateDoubleOptInStatus(data) {
  return performBulkUpdateDoubleOptInStatus(data);
}
export function updateLocalLawfulBasis(lawfulBasis) {
  dispatchSafe(EMAIL_LAWFUL_BASIS_ADDED, lawfulBasis);
}
export function completeLocalLawfulBasis(subjectId) {
  dispatchSafe(EMAIL_LAWFUL_BASIS_COMPLETE, subjectId);
}