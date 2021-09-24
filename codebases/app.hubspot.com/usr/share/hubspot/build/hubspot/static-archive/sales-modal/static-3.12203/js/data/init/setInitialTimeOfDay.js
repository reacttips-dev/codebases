'use es6';

import { getCurrentTimeOfDayInMs } from 'sales-modal/utils/enrollModal/timeSelectorUtils';
import getFirstEditableStepIndex from 'sales-modal/utils/enrollModal/getFirstEditableStepIndex';
import { EnrollTypes } from 'sales-modal/constants/EnrollTypes';
export default function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      enrollType = _ref.enrollType;
  var timeOfInitialization = sequenceEnrollment.timeOfInitialization,
      timezone = sequenceEnrollment.timezone;
  var timeOfDay = getCurrentTimeOfDayInMs(timeOfInitialization.clone().tz(timezone));
  var userAlreadyChoseStepTimes = enrollType === EnrollTypes.EDIT || enrollType === EnrollTypes.RESUME || enrollType === EnrollTypes.VIEW;

  if (userAlreadyChoseStepTimes) {
    return sequenceEnrollment;
  }

  var firstEditableStepIndex = getFirstEditableStepIndex(sequenceEnrollment, sequenceEnrollment.stepEnrollments);
  var preservingRemediationReenrollTimes = enrollType === EnrollTypes.REENROLL && sequenceEnrollment.steps.getIn([firstEditableStepIndex, 'absoluteTime']) !== null;

  if (preservingRemediationReenrollTimes) {
    if (sequenceEnrollment.initialTouchDelay === 0) {
      var startingStepOrder = sequenceEnrollment.startingStepOrder;
      return sequenceEnrollment.updateIn(['steps', startingStepOrder], function (step) {
        return step.set('timeOfDay', timeOfDay);
      });
    }

    return sequenceEnrollment;
  }

  return sequenceEnrollment.withMutations(function (_sequenceEnrollment) {
    return _sequenceEnrollment.set('initialTouchDelay', 0).update('steps', function (steps) {
      return steps.map(function (step) {
        return step.set('timeOfDay', timeOfDay);
      });
    });
  });
}