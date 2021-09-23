'use es6';

import I18n from 'I18n';
import { SEND_IMMEDIATELY } from 'sales-modal/constants/FirstSendTypes';
import { SCHEDULE_TASK } from 'sales-modal/constants/SequenceStepTypes';
import getFirstEditableStepIndex from 'sales-modal/utils/enrollModal/getFirstEditableStepIndex';
import { List } from 'immutable';
import { wasExecuted } from '../stepEnrollmentStates';
import { BUSINESS_DAYS } from 'sales-modal/constants/EligibleFollowUpDays';
import { addDelayAsBusinessDays } from 'sales-modal/utils/weekDays';
import getSendDate from './getSendDate';
import { getCurrentTimeOfDayInMs } from 'sales-modal/utils/enrollModal/timeSelectorUtils'; // Actual execution time is +-1 second, but we want to make sure tasks are created on or after midnight

var FIVE_SECONDS_PAST_MIDNIGHT = 5 * 1000;

var getSendDateWithTimezone = function getSendDateWithTimezone(sequenceEnrollment) {
  var timezoneName = sequenceEnrollment.get('timezone');
  var sendDate = getSendDate(sequenceEnrollment);
  return timezoneName ? sendDate.clone().tz(timezoneName) : sendDate;
};

var getPreviousStepWithDelay = function getPreviousStepWithDelay(_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      stepIndex = _ref.stepIndex;
  var firstEditableStepIndex = getFirstEditableStepIndex(sequenceEnrollment);
  return sequenceEnrollment.get('steps').slice(firstEditableStepIndex, stepIndex).findLast(function (step) {
    return step.get('delay') !== 0;
  }) || sequenceEnrollment.get('steps').get(firstEditableStepIndex);
};

var stepHasNoDelay = function stepHasNoDelay(_ref2) {
  var sequenceEnrollment = _ref2.sequenceEnrollment,
      stepIndex = _ref2.stepIndex;
  return sequenceEnrollment.getIn(['steps', stepIndex, 'delay']) === 0 && stepIndex > getFirstEditableStepIndex(sequenceEnrollment);
};

var shouldSendStartingStepImmediately = function shouldSendStartingStepImmediately(_ref3) {
  var sequenceEnrollment = _ref3.sequenceEnrollment;
  var firstSendType = sequenceEnrollment.get('firstSendType');
  var initialTouchDelay = sequenceEnrollment.get('initialTouchDelay');
  return initialTouchDelay === 0 && firstSendType === SEND_IMMEDIATELY;
};

var setStepIndex = function setStepIndex(_ref4) {
  var sequenceEnrollment = _ref4.sequenceEnrollment,
      stepIndex = _ref4.stepIndex;
  var isNoDelayStep = stepHasNoDelay({
    sequenceEnrollment: sequenceEnrollment,
    stepIndex: stepIndex
  });
  var previousStepWithDelay = getPreviousStepWithDelay({
    sequenceEnrollment: sequenceEnrollment,
    stepIndex: stepIndex
  });
  return isNoDelayStep ? previousStepWithDelay.get('stepOrder') : stepIndex;
};

var aggregateStepMoment = function aggregateStepMoment(_ref5) {
  var sequenceEnrollment = _ref5.sequenceEnrollment,
      stepIndex = _ref5.stepIndex;
  var sendDateWithTimezone = getSendDateWithTimezone(sequenceEnrollment);
  var initialTouchDelay = sequenceEnrollment.get('initialTouchDelay');
  var startingStepOrder = sequenceEnrollment.get('startingStepOrder');
  var sendOnWeekdays = sequenceEnrollment.getIn(['sequenceSettings', 'eligibleFollowUpDays']) === BUSINESS_DAYS;
  var eligibleFollowUpDays = sequenceEnrollment.getIn(['sequenceSettings', 'eligibleFollowUpDays']);
  var completedStepsByOrder = (sequenceEnrollment.stepEnrollments || List()).filter(wasExecuted).groupBy(function (s) {
    return s.get('stepOrder');
  }).map(function (s) {
    return s.first();
  });

  var getStartingStepMoment = function getStartingStepMoment() {
    if (!completedStepsByOrder.get(startingStepOrder) && shouldSendStartingStepImmediately({
      sequenceEnrollment: sequenceEnrollment
    })) {
      return I18n.moment().tz(sequenceEnrollment.get('timezone'));
    }

    if (eligibleFollowUpDays === BUSINESS_DAYS) {
      return addDelayAsBusinessDays(sendDateWithTimezone, initialTouchDelay);
    } else {
      return sendDateWithTimezone.clone().add(initialTouchDelay, 'ms');
    }
  };

  return sequenceEnrollment.get('steps').slice(0, stepIndex + 1).reduce(function (_ref6, step) {
    var stepMoment = _ref6.stepMoment;
    var stepOrder = step.get('stepOrder');
    var completedStep = completedStepsByOrder.get(stepOrder);

    if (completedStep) {
      return {
        stepMoment: I18n.moment(completedStep.get('executedTimestamp')).tz(sequenceEnrollment.get('timezone'))
      };
    }

    if (stepOrder < startingStepOrder) {
      // For skipped steps, we overwrite the returned value in the default fn
      return {
        stepMoment: stepMoment
      };
    }

    if (stepOrder === startingStepOrder) {
      return {
        stepMoment: getStartingStepMoment()
      };
    } // previousStepEstimatedCompletionCalendarDaysDelay will only be populated on the
    // first editable step when it has a pausing dependency and the sequence
    // has resumed.


    var stepDelay = step.get('delay');
    var previousStepCompletionMoment = stepMoment.clone().add(step.get('previousStepEstimatedCompletionCalendarDaysDelay', 0), 'milliseconds');

    if (eligibleFollowUpDays === BUSINESS_DAYS) {
      stepMoment = addDelayAsBusinessDays(previousStepCompletionMoment, stepDelay);
      return {
        stepMoment: stepMoment
      };
    }

    stepMoment = previousStepCompletionMoment.clone().add(stepDelay, 'milliseconds');

    if (sendOnWeekdays) {
      var dayOfWeek = stepMoment.day();

      if (dayOfWeek === 0) {
        stepMoment = stepMoment.add(1, 'days');
      } else if (dayOfWeek === 6) {
        stepMoment = stepMoment.add(2, 'days');
      }
    }

    return {
      stepMoment: stepMoment
    };
  }, {
    stepMoment: getStartingStepMoment()
  });
};

var getTaskTimeOfDay = function getTaskTimeOfDay(_ref7) {
  var sequenceEnrollment = _ref7.sequenceEnrollment,
      stepIndex = _ref7.stepIndex,
      stepMoment = _ref7.stepMoment;
  var firstSendType = sequenceEnrollment.firstSendType,
      startingStepOrder = sequenceEnrollment.startingStepOrder;
  var firstEditableStepIndex = getFirstEditableStepIndex(sequenceEnrollment);

  if (stepIndex === firstEditableStepIndex) {
    var currentMoment = I18n.moment().tz(sequenceEnrollment.get('timezone'));
    var currentTimeOfDay = getCurrentTimeOfDayInMs(currentMoment);

    if (firstSendType === SEND_IMMEDIATELY) {
      if (stepIndex === startingStepOrder) {
        // `setFirstSendType` and `setEnrollmentStartingOrder` ensure this value
        // is the current time of day in browser timezone
        return sequenceEnrollment.getIn(['steps', stepIndex, 'timeOfDay']);
      } else {
        return currentTimeOfDay;
      }
    }
    /*
     * For the firstEditableStep, a step with delay === 0 executes today,
     * and a step with delay > 0 might execute today, e.g.
     *   Editing an EXECUTING enrollment, where the previous step executed 2 days ago.
     *   The user chooses SEND_SPECIFIC_TIME in the dropdown (which sets the firstSendType),
     *   and brings up the date picker. On the date picker, the user can choose today's date,
     *   which is 2 days after the previous step date, so the delay is 2 * DAY.
     */


    if (stepMoment.isSame(currentMoment, 'day')) {
      return currentTimeOfDay;
    }
  }

  return FIVE_SECONDS_PAST_MIDNIGHT;
};

var getStepMoment = function getStepMoment(_ref8) {
  var sequenceEnrollment = _ref8.sequenceEnrollment,
      stepIndex = _ref8.stepIndex;

  var _aggregateStepMoment = aggregateStepMoment({
    sequenceEnrollment: sequenceEnrollment,
    stepIndex: stepIndex
  }),
      stepMoment = _aggregateStepMoment.stepMoment;

  var stepTimeOfDay = sequenceEnrollment.getIn(['steps', stepIndex, 'timeOfDay']);
  var stepType = sequenceEnrollment.getIn(['steps', stepIndex, 'action']);

  if (stepType === SCHEDULE_TASK) {
    stepTimeOfDay = getTaskTimeOfDay({
      sequenceEnrollment: sequenceEnrollment,
      stepIndex: stepIndex,
      stepMoment: stepMoment
    });
  }

  var startOfDay = stepMoment.clone().startOf('day');
  var adjustedStepMoment = startOfDay.add(stepTimeOfDay, 'milliseconds');
  return {
    stepMoment: adjustedStepMoment
  };
};

export default (function (sequenceEnrollment, stepIndex) {
  var sendDateWithTimezone = getSendDateWithTimezone(sequenceEnrollment);
  var startingStepOrder = sequenceEnrollment.get('startingStepOrder');
  var updatedStepIndex = setStepIndex({
    sequenceEnrollment: sequenceEnrollment,
    stepIndex: stepIndex
  });

  var _getStepMoment = getStepMoment({
    sequenceEnrollment: sequenceEnrollment,
    stepIndex: updatedStepIndex
  }),
      stepMoment = _getStepMoment.stepMoment;

  if (stepIndex < startingStepOrder) {
    return {
      stepMoment: sendDateWithTimezone,
      absoluteTime: null
    };
  }

  return {
    stepMoment: stepMoment,
    absoluteTime: stepMoment.valueOf()
  };
});