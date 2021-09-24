'use es6';

import http from 'hub-http/clients/apiClient';
import { SUBSCRIPTION_URL } from '../constants/SubscriptionConstants';
import { debug } from '../util/DebugUtil';
export function addSubscription(subscription) {
  return http.post(SUBSCRIPTION_URL, {
    data: subscription
  }).catch(function (error) {
    return debug('Notifications subscription: Error sending subscription to backend', error);
  });
}