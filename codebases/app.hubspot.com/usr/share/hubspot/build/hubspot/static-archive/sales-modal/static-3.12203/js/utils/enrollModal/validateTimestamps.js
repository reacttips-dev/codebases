'use es6';

import getAbsoluteTime from 'sales-modal/utils/enrollModal/getAbsoluteTime';
import I18n from 'I18n';
import { executionAttemptedOrFinished } from 'sales-modal/utils/stepEnrollmentStates';
import getFirstEditableStepIndex from 'sales-modal/utils/enrollModal/getFirstEditableStepIndex';

var getTimeOfDay = function getTimeOfDay(_ref) {
  var timezone = _ref.timezone,
      absoluteTime = _ref.absoluteTime;
  var updatedMoment = timezone ? I18n.moment(absoluteTime).tz(timezone) : I18n.moment(absoluteTime);
  var startOfDay = updatedMoment.clone().startOf('day');
  return updatedMoment.diff(startOfDay);
};

export default function (_ref2) {
  var sequenceEnrollment = _ref2.sequenceEnrollment;
  var startingStepOrder = sequenceEnrollment.startingStepOrder,
      initialTouchDelay = sequenceEnrollment.initialTouchDelay,
      stepEnrollments = sequenceEnrollment.stepEnrollments,
      timezone = sequenceEnrollment.timezone;
  var firstEditableStepIndex = getFirstEditableStepIndex(sequenceEnrollment);
  var currentTime = I18n.moment().tz(timezone).valueOf();
  return sequenceEnrollment.update('steps', function (steps) {
    return steps.map(function (step, index) {
      if (index < firstEditableStepIndex) {
        return step;
      }

      if (stepEnrollments) {
        var stepEnrollment = stepEnrollments.get(index);
        var isExecutedStep = stepEnrollment && executionAttemptedOrFinished(stepEnrollment);

        if (isExecutedStep) {
          return step;
        }
      } // eslint-disable-next-line prefer-const


      var _getAbsoluteTime = getAbsoluteTime(sequenceEnrollment, index),
          absoluteTime = _getAbsoluteTime.absoluteTime,
          stepMoment = _getAbsoluteTime.stepMoment;

      if (absoluteTime < currentTime) {
        absoluteTime = currentTime;
      }

      var updatedStep = step;

      if (index === startingStepOrder) {
        updatedStep = updatedStep.set('delay', initialTouchDelay);
      }

      var timeOfDay = getTimeOfDay({
        timezone: stepMoment.tz(),
        absoluteTime: absoluteTime
      });
      return updatedStep.merge({
        absoluteTime: absoluteTime,
        timeOfDay: timeOfDay
      });
    });
  });
}