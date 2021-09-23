'use es6';

import { get, post, send } from 'crm_data/api/ImmutableAPI';
import makeBatch from 'crm_data/api/makeBatch';

var getURI = function getURI(email) {
  return "email/v1/contacts/" + encodeURIComponent(email) + "/subscriptions?source=SOURCE_HUBSPOT_CUSTOMER";
};

export function fetch(email) {
  return get(getURI(email));
}
export var fetchByIds = makeBatch(fetch, 'EmailSubscriptionAPI.fetch');
export function sendOptIn(email) {
  return post("email/v1/optin/addresses/status/" + encodeURIComponent(email) + "/confirm-with-message");
}
export function unsubscribe(email) {
  return post(getURI(email), {
    unsubscribeFromPortal: true
  });
}
export var performBulkUpdateDoubleOptInStatus = function performBulkUpdateDoubleOptInStatus(_ref) {
  var isDoubleOptedIn = _ref.isDoubleOptedIn,
      criteria = _ref.criteria;
  return send({
    type: 'POST',
    dataType: 'text'
  }, 'subscriptions/v1/bulk-update-resource', Object.assign({
    doiState: isDoubleOptedIn ? 'CUSTOMER_CONFIRMED' : 'RESET_NULL_STATE'
  }, criteria));
};