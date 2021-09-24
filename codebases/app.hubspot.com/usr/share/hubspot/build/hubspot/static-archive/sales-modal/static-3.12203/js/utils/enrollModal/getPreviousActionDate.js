'use es6';

import I18n from 'I18n';
import { List } from 'immutable';
import memoize from 'transmute/memoize';
import { wasExecuted } from 'sales-modal/utils/stepEnrollmentStates';
import { BUSINESS_DAYS } from 'sales-modal/constants/EligibleFollowUpDays';
import { DAY } from 'sales-modal/constants/Milliseconds';
import { subtractWeekDays } from 'sales-modal/utils/weekDays';
import { EnrollmentStates } from 'sales-modal/constants/EnrollmentStates';
import { EnrollTypes } from 'sales-modal/constants/EnrollTypes';
import getSendDate from './getSendDate';
export default memoize(function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      enrollType = _ref.enrollType;
  var stepEnrollments = sequenceEnrollment.stepEnrollments,
      timezone = sequenceEnrollment.timezone;

  if (!stepEnrollments || enrollType === EnrollTypes.REENROLL) {
    return sequenceEnrollment.get('timeOfInitialization').tz(timezone);
  }

  var finishedSteps = stepEnrollments.filter(wasExecuted);

  if (finishedSteps.size === 0) {
    return getSendDate(sequenceEnrollment);
  }

  var lastFinishedStep = finishedSteps.last(); // BE does not enqueue further out than the next step

  var nextStep = stepEnrollments.filterNot(wasExecuted).last();
  var nextStepWasDependentOnPausingTask = nextStep && !nextStep.getIn(['step', 'dependencies'], List()).isEmpty(); // This delay will either have been used from the BE or calculated in setInitialValues

  var previousStepEstimatedCompletionCalendarDaysDelay = nextStep ? sequenceEnrollment.getIn(['steps', nextStep.get('stepOrder'), 'previousStepEstimatedCompletionCalendarDaysDelay']) : null;

  if (previousStepEstimatedCompletionCalendarDaysDelay || nextStepWasDependentOnPausingTask && sequenceEnrollment.get('enrollmentState') !== EnrollmentStates.PAUSED) {
    // if we've already estimated, then just read the previousStepEstimatedCompletionCalendarDaysDelay off and add it. That protects us from settings changes.
    if (previousStepEstimatedCompletionCalendarDaysDelay !== undefined) {
      return I18n.moment(lastFinishedStep.get('executedTimestamp') + previousStepEstimatedCompletionCalendarDaysDelay).tz(timezone);
    } // Estimate the task completion by backing out the delay from the currently
    // scheduled time and taking the start of that day. This is the closest
    // approximation we have available for scheduling the next task.


    var estimatedTaskCompletionDate;
    var nextStepScheduledDate = I18n.moment(nextStep.getIn(['step', 'absoluteTime'])).tz(timezone).startOf('day');

    if (sequenceEnrollment.getIn(['sequenceSettings', 'eligibleFollowUpDays']) === BUSINESS_DAYS) {
      estimatedTaskCompletionDate = subtractWeekDays(nextStepScheduledDate, nextStep.getIn(['step', 'delay']) / DAY);
    } else {
      estimatedTaskCompletionDate = nextStepScheduledDate.subtract(nextStep.getIn(['step', 'delay']), 'ms');
    }

    return estimatedTaskCompletionDate;
  }

  return I18n.moment(lastFinishedStep.get('executedTimestamp')).tz(timezone);
});