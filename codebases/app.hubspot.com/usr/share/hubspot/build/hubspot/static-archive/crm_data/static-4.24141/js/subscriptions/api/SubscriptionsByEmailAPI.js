'use es6';

import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import makeBatch from 'crm_data/api/makeBatch';
import { Map as ImmutableMap } from 'immutable';
var BRAND_SUBSCRIPTIONS_URI = '/subscriptions/v1/preferences-group/all';

function getCreateURI(email, queryString) {
  return "/email/v2/contacts/" + encodeURIComponent(email) + "/subscriptions?" + queryString;
}

function getFetchURI(email) {
  return "/email/v1/subscriptions/" + encodeURIComponent(email);
}

export var fetchSubscriptions = function fetchSubscriptions(email) {
  return ImmutableAPI.get(getFetchURI(email));
};
export var fetchBrandSubscriptions = function fetchBrandSubscriptions() {
  return ImmutableAPI.get(BRAND_SUBSCRIPTIONS_URI).then(function (data) {
    return ImmutableMap().set('subscriptionBrands', data);
  });
};
export var batchFetchSubscriptions = makeBatch(fetchSubscriptions, 'SubscriptionsByEmailAPI.fetchSubscriptions');
export var updateSubscription = function updateSubscription(email, body) {
  var uri = getCreateURI(email, 'source=SOURCE_HUBSPOT_CUSTOMER');
  return ImmutableAPI.post(uri, body);
};