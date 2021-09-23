'use es6';

import memoize from 'transmute/memoize';
import { SEND_TEMPLATE } from 'sales-modal/constants/SequenceStepTypes';
import { executionAttemptedOrFinished } from 'sales-modal/utils/stepEnrollmentStates';
export default memoize(function (stepEnrollments) {
  if (!stepEnrollments) {
    return null;
  }

  var finishedEmails = stepEnrollments.filter(function (stepEnrollment) {
    return executionAttemptedOrFinished(stepEnrollment) && stepEnrollment.getIn(['step', 'action']) === SEND_TEMPLATE;
  });

  if (finishedEmails.size > 0) {
    return finishedEmails.last();
  }

  return null;
});