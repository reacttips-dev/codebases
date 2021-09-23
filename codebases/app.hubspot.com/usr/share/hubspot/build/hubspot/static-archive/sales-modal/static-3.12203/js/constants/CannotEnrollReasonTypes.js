'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import * as SubscriptionStatusTypes from 'sales-modal/constants/SubscriptionStatusTypes';

var __OTHER_SUBSCRIPTION_REJECTED = SubscriptionStatusTypes.OTHER_SUBSCRIPTION_REJECTED,
    __OK = SubscriptionStatusTypes.OK,
    cannotEnrollSubscriptionStatuses = _objectWithoutProperties(SubscriptionStatusTypes, ["OTHER_SUBSCRIPTION_REJECTED", "OK"]);

var CannotEnrollReasonTypes = Object.assign({}, cannotEnrollSubscriptionStatuses, {
  ALREADY_ENROLLED: 'ALREADY_ENROLLED',
  CANNOT_COMMUNICATE: 'CANNOT_COMMUNICATE',
  MISSING_EMAIL_ADDRESS: 'MISSING_EMAIL_ADDRESS',
  UNKNOWN: 'UNKNOWN'
});
export default CannotEnrollReasonTypes;