'use es6';

import allowedSubscriptionStatus from 'sales-modal/utils/allowedSubscriptionStatus';
export default (function (_ref) {
  var eligibility = _ref.eligibility,
      stepEnrollments = _ref.stepEnrollments;
  var currentEnrollment = eligibility.getIn(['metadata', 'activeEnrollment']);
  var subscriptionStatus = eligibility.getIn(['metadata', 'salesSubscriptionStatus']);
  var contactWithoutCommunicatePermissions = eligibility.get('cannotCommunicate');
  var allowedToEnroll = allowedSubscriptionStatus(subscriptionStatus);
  var alreadyEnrolled = currentEnrollment !== null;
  return !allowedToEnroll || alreadyEnrolled && !stepEnrollments || contactWithoutCommunicatePermissions;
});