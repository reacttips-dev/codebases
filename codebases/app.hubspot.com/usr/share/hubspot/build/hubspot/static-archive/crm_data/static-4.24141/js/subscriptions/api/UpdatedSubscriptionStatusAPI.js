'use es6';

import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import makeBatch from 'crm_data/api/makeBatch';
var RESUBSCRIBE_URI = '/subscriptions/v1/bulk-update-resource';

function getFetchURI(email) {
  return "subscriptions/v1/status/subscribers/" + encodeURIComponent(email) + "/types/email/brands";
}

function getCreateURI(email) {
  return "/subscriptions/v1/status/email/" + encodeURIComponent(email);
}

export var fetchSubscriptions = function fetchSubscriptions(email) {
  return ImmutableAPI.get(getFetchURI(email));
};
export var updateSubscription = function updateSubscription(email, body) {
  var uri = getCreateURI(email);
  return ImmutableAPI.post(uri, [body]);
};
export var resubscribeContact = function resubscribeContact(body) {
  return ImmutableAPI.send({
    type: 'POST',
    dataType: 'text'
  }, RESUBSCRIBE_URI, body);
};
export var batchFetchSubscriptions = makeBatch(fetchSubscriptions, 'UpdatedSubscriptionStatusAPI.fetchSubscriptions');