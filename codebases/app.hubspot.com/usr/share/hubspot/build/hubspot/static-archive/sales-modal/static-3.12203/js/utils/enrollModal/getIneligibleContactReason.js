'use es6';

import allowedSubscriptionStatus from 'sales-modal/utils/allowedSubscriptionStatus';
import CannotEnrollReasonTypes from 'sales-modal/constants/CannotEnrollReasonTypes';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';

var getIneligibleContactReason = function getIneligibleContactReason(_ref) {
  var contact = _ref.contact,
      eligibility = _ref.eligibility;
  var subscriptionStatus = eligibility.getIn(['metadata', 'salesSubscriptionStatus']);

  if (!allowedSubscriptionStatus(subscriptionStatus)) {
    return subscriptionStatus;
  }

  var email = getProperty(contact, 'email');

  if (!email) {
    return CannotEnrollReasonTypes.MISSING_EMAIL_ADDRESS;
  }

  if (eligibility.get('cannotCommunicate')) {
    return CannotEnrollReasonTypes.CANNOT_COMMUNICATE;
  }

  var currentEnrollment = eligibility.getIn(['metadata', 'activeEnrollment']);

  if (currentEnrollment !== null) {
    // Does not account for editing enrollments
    return CannotEnrollReasonTypes.ALREADY_ENROLLED;
  }

  return null;
};

export default getIneligibleContactReason;