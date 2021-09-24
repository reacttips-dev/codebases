'use es6';

import memoize from 'transmute/memoize';
import { isEditable } from 'sales-modal/utils/stepEnrollmentStates';
export default memoize(function (sequenceEnrollment, stepEnrollmentList) {
  var stepEnrollments = sequenceEnrollment.stepEnrollments || stepEnrollmentList;
  var firstIncompleteStep = sequenceEnrollment.get('steps').filterNot(function (step) {
    if (!stepEnrollments) {
      return false;
    }

    return stepEnrollments.find(function (stepEnrollment) {
      return stepEnrollment.get('stepOrder') === step.get('stepOrder') && !isEditable(stepEnrollment);
    });
  }).first();
  var firstIncompleteStepIndex = firstIncompleteStep ? firstIncompleteStep.get('stepOrder') : sequenceEnrollment.get('steps').size - 1;
  return Math.max(sequenceEnrollment.get('startingStepOrder'), firstIncompleteStepIndex);
});