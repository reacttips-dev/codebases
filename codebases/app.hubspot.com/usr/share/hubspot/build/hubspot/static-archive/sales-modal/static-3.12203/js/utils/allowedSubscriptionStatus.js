'use es6';

import { OK, OTHER_SUBSCRIPTION_REJECTED } from 'sales-modal/constants/SubscriptionStatusTypes';
export default (function (type) {
  return !type || type === OK || type === OTHER_SUBSCRIPTION_REJECTED;
});