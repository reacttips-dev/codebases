'use es6';

import getPreviousActionDate from 'sales-modal/utils/enrollModal/getPreviousActionDate';
import { DAY } from 'sales-modal/constants/Milliseconds';
import { BUSINESS_DAYS } from 'sales-modal/constants/EligibleFollowUpDays';
import { diffWeekDays } from 'sales-modal/utils/weekDays'; // Calculates delay in milliseconds from the previous action to the given
// timestamp. Used for handling the first editable step delay.

export default function calculateDayDelay(sequenceEnrollment, moment, enrollType) {
  var sendOnWeekdays = sequenceEnrollment.getIn(['sequenceSettings', 'eligibleFollowUpDays']) === BUSINESS_DAYS;
  var previousActionStartOfDay = getPreviousActionDate({
    sequenceEnrollment: sequenceEnrollment,
    enrollType: enrollType
  }).clone().startOf('day');
  var dayDelay = sendOnWeekdays ? diffWeekDays(previousActionStartOfDay, moment) : moment.diff(previousActionStartOfDay, 'days');
  return dayDelay * DAY;
}