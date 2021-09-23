'use es6';

import { SEND_IMMEDIATELY } from 'sales-modal/constants/FirstSendTypes';
import { getCurrentTimeOfDayInMs } from 'sales-modal/utils/enrollModal/timeSelectorUtils';
import getFirstEditableStepIndex from 'sales-modal/utils/enrollModal/getFirstEditableStepIndex';
import getAbsoluteTime from 'sales-modal/utils/enrollModal/getAbsoluteTime';
import calculateDayDelay from 'sales-modal/utils/enrollModal/calculateDayDelay';
import { BUSINESS_DAYS } from 'sales-modal/constants/EligibleFollowUpDays';
import { EnrollmentStates } from 'sales-modal/constants/EnrollmentStates';
import { EnrollTypes } from '../../constants/EnrollTypes';
export default function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      enrollType = _ref.enrollType;
  var timezone = sequenceEnrollment.timezone,
      firstSendType = sequenceEnrollment.firstSendType,
      initialTouchDelay = sequenceEnrollment.initialTouchDelay,
      startingStepOrder = sequenceEnrollment.startingStepOrder,
      timeOfInitialization = sequenceEnrollment.timeOfInitialization,
      stepEnrollments = sequenceEnrollment.stepEnrollments;

  if (enrollType === EnrollTypes.VIEW) {
    return sequenceEnrollment;
  }

  var firstEditableStepIndex = getFirstEditableStepIndex(sequenceEnrollment, stepEnrollments);
  var initialStepTime = sequenceEnrollment.getIn(['steps', firstEditableStepIndex, 'timeOfDay']);
  var moment = timeOfInitialization.clone().tz(timezone);
  var currentTimeOfDay = getCurrentTimeOfDayInMs(moment);

  if (startingStepOrder === firstEditableStepIndex) {
    // first step of the enrollment is the one we care about validating, so
    // initialTouchDelay is useful. if we're sending the first step immediately
    // we don't want to change anything here - validateTimestamps will cover it
    var stepDateInFuture = initialTouchDelay > 0 || initialStepTime >= currentTimeOfDay;

    if (firstSendType === SEND_IMMEDIATELY || stepDateInFuture) {
      return sequenceEnrollment;
    }
  } else if (sequenceEnrollment.get('enrollmentState') === EnrollmentStates.PAUSED) {
    // Don't adjust the day delay if we're paused, we leave the absolute times
    // as-is and the BE adjusts when the sequence un-pauses.
    return sequenceEnrollment;
  } else {
    // the first editable step isn't the first step of the enrollment, so we
    // need to check the generated absoluteTime
    var _getAbsoluteTime = getAbsoluteTime(sequenceEnrollment, firstEditableStepIndex),
        stepMoment = _getAbsoluteTime.stepMoment;

    var currentStartOfDay = moment.clone().startOf('day');
    var stepStartOfDay = stepMoment.clone().startOf('day');

    if (currentStartOfDay.isBefore(stepStartOfDay) || initialStepTime > currentTimeOfDay) {
      return sequenceEnrollment;
    }
  }

  var sendDate = moment.clone().add(1, 'days');
  var isSaturday = sendDate.day() === 6;
  var sendOnWeekdays = sequenceEnrollment.getIn(['sequenceSettings', 'eligibleFollowUpDays']) === BUSINESS_DAYS;

  if (sendOnWeekdays && isSaturday) {
    sendDate.day(8);
  }

  var dayDelayInMs = calculateDayDelay(sequenceEnrollment, sendDate, enrollType);

  if (startingStepOrder === firstEditableStepIndex) {
    return sequenceEnrollment.set('initialTouchDelay', dayDelayInMs);
  }

  return sequenceEnrollment.setIn(['steps', firstEditableStepIndex, 'delay'], dayDelayInMs);
}