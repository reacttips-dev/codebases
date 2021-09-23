'use es6';

import I18n from 'I18n';
import { Range } from 'immutable';
import getAbsoluteTime from 'sales-modal/utils/enrollModal/getAbsoluteTime';
import { SCHEDULE_TASK } from 'sales-modal/constants/SequenceStepTypes';
import formatShortDate from 'I18n/utils/formatShortDate';
import { executionAttemptedOrFinished } from 'sales-modal/utils/stepEnrollmentStates';
export var getSendTimesToValidate = function getSendTimesToValidate(_ref) {
  var previousStepSendTime = _ref.previousStepSendTime,
      sendOnWeekdays = _ref.sendOnWeekdays,
      _ref$rangeEnd = _ref.rangeEnd,
      rangeEnd = _ref$rangeEnd === void 0 ? 13 : _ref$rangeEnd;
  return Range(1, rangeEnd).map(function (delayValue) {
    var calculatedTimestamp = I18n.moment(previousStepSendTime).add(delayValue, 'days');

    if (sendOnWeekdays) {
      var dayOfWeek = calculatedTimestamp.day();

      if (dayOfWeek === 0) {
        calculatedTimestamp = calculatedTimestamp.add(1, 'days');
      } else if (dayOfWeek === 6) {
        calculatedTimestamp = calculatedTimestamp.add(2, 'days');
      }
    }

    return calculatedTimestamp.valueOf();
  }).toList();
};
export var isAttemptedOrFinishedStep = function isAttemptedOrFinishedStep(stepIndex, stepEnrollments) {
  return stepEnrollments && stepEnrollments.find(function (step) {
    return step.get('stepOrder') === stepIndex && executionAttemptedOrFinished(step);
  });
};
export var getSendDateForStep = function getSendDateForStep(sequenceEnrollment, stepIndex, stepEnrollments) {
  var startingStepOrder = sequenceEnrollment.get('startingStepOrder');

  if (stepIndex < startingStepOrder) {
    return null;
  }

  if (isAttemptedOrFinishedStep(stepIndex, sequenceEnrollment.get('stepEnrollments') || stepEnrollments)) {
    return null;
  }

  if (sequenceEnrollment.getIn(['steps', stepIndex, 'action']) === SCHEDULE_TASK) {
    return null;
  }

  var _getAbsoluteTime = getAbsoluteTime(sequenceEnrollment, stepIndex),
      absoluteTime = _getAbsoluteTime.absoluteTime;

  return absoluteTime;
};
export var getSendTimesWereChanged = function getSendTimesWereChanged(sequenceEnrollment, prevSequenceEnrollment) {
  if (!sequenceEnrollment || !prevSequenceEnrollment) return false;
  return prevSequenceEnrollment.get('inboxAddress') !== sequenceEnrollment.get('inboxAddress') || prevSequenceEnrollment.get('firstSendType') !== sequenceEnrollment.get('firstSendType') || prevSequenceEnrollment.get('startingStepOrder') !== sequenceEnrollment.get('startingStepOrder') || prevSequenceEnrollment.get('initialTouchDelay') !== sequenceEnrollment.get('initialTouchDelay') || prevSequenceEnrollment.get('timezone') !== sequenceEnrollment.get('timezone') || prevSequenceEnrollment.get('steps').some(function (step, index) {
    return prevSequenceEnrollment.getIn(['steps', index, 'delay']) !== sequenceEnrollment.getIn(['steps', index, 'delay']) || prevSequenceEnrollment.getIn(['steps', index, 'timeOfDay']) !== sequenceEnrollment.getIn(['steps', index, 'timeOfDay']);
  });
};
export var isSameDay = function isSameDay(timestamp, timezone) {
  return I18n.moment(timestamp).tz(timezone).isSame(I18n.moment().tz(timezone), 'day');
};
export var getFirstStepWithErrorDate = function getFirstStepWithErrorDate(stepsWithSendTimeErrors, sendLimits, errorType) {
  var stepIndex = stepsWithSendTimeErrors.findKey(function (error) {
    return error === errorType;
  });
  return sendLimits.findKey(function (limitData) {
    return limitData.get('stepNumber') - 1 === stepIndex;
  });
};
export var getMessagePropsForSendTimeError = function getMessagePropsForSendTimeError(stepsWithSendTimeErrors, sendLimits, errorType, timezone) {
  var date = getFirstStepWithErrorDate(stepsWithSendTimeErrors, sendLimits, errorType);
  var isDateToday = isSameDay(Number(date), timezone);
  return {
    limit: sendLimits.get(date).get('sendLimit'),
    formattedDate: formatShortDate(I18n.moment(Number(date)).tz(timezone)),
    isDateToday: isDateToday
  };
};
export var getReadOnlyTimeInfo = function getReadOnlyTimeInfo(_ref2) {
  var stepIndex = _ref2.stepIndex,
      sequenceEnrollment = _ref2.sequenceEnrollment;
  var steps = sequenceEnrollment.steps,
      stepEnrollments = sequenceEnrollment.stepEnrollments,
      timezone = sequenceEnrollment.timezone;
  var stepEnrollment = stepEnrollments && stepEnrollments.find(function (s) {
    return s.get('stepOrder') === stepIndex;
  });
  var executedTimestamp = stepEnrollment && stepEnrollment.get('executedTimestamp');
  var scheduledExecution = stepEnrollment && stepEnrollment.get('scheduledExecution');
  var absoluteTime = steps.getIn([stepIndex, 'absoluteTime']);
  var stepMomentScheduled = I18n.moment(scheduledExecution || absoluteTime).tz(timezone);
  return {
    stepEnrollment: stepEnrollment,
    executedTimestamp: executedTimestamp,
    scheduledExecution: scheduledExecution,
    absoluteTime: absoluteTime,
    stepMomentScheduled: stepMomentScheduled
  };
};