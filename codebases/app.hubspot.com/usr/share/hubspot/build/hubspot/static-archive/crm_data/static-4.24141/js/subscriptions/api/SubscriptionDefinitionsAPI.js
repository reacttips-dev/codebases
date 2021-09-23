'use es6';

import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import { Map as ImmutableMap } from 'immutable';
var SUBSCRIPTION_ENDPOINT = 'email/v1/subscriptions/definitions?includeInternal=true';
var SMART_SUBSCRIPTION_ENDPOINT = 'subscriptions/v1/definitions/by-subscription-key';
export var fetchSubscriptionDefinitions = function fetchSubscriptionDefinitions() {
  return ImmutableAPI.get(SUBSCRIPTION_ENDPOINT).then(function (data) {
    return ImmutableMap().set('subscriptionDefinitions', data);
  });
};
export var performApplySubscriptionByKey = function performApplySubscriptionByKey(type, portalId) {
  return ImmutableAPI.send({
    type: 'PUT'
  }, SMART_SUBSCRIPTION_ENDPOINT + "/" + encodeURIComponent(type) + "?portalId=" + portalId);
};