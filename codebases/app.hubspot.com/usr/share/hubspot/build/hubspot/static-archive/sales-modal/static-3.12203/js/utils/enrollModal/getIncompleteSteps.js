'use es6';

import memoize from 'transmute/memoize';
import { Map as ImmutableMap } from 'immutable';
import getVisibleSteps from 'sales-modal/utils/enrollModal/getVisibleSteps';
import { isEditable } from 'sales-modal/utils/stepEnrollmentStates';
var getIncompleteSteps = memoize(function (sequenceEnrollment) {
  var stepEnrollments = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : sequenceEnrollment.stepEnrollments;

  if (stepEnrollments) {
    var stepEnrollmentMap = stepEnrollments.reduce(function (_stepEnrollmentMap, step) {
      return _stepEnrollmentMap.set(step.get('stepOrder'), step);
    }, ImmutableMap());
    return getVisibleSteps(sequenceEnrollment).filter(function (step) {
      var stepEnrollment = stepEnrollmentMap.get(step.get('stepOrder'));
      return !stepEnrollment || isEditable(stepEnrollment);
    });
  }

  return getVisibleSteps(sequenceEnrollment);
});
export default getIncompleteSteps;