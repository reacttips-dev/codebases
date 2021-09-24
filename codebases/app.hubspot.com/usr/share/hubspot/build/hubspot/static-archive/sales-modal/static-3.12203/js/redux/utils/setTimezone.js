'use es6';

import I18n from 'I18n';
import validateDates from 'sales-modal/redux/utils/validateDates';
import { SEND_IMMEDIATELY } from 'sales-modal/constants/FirstSendTypes';
import getFirstEditableStepIndex from 'sales-modal/utils/enrollModal/getFirstEditableStepIndex';
import { getCurrentTimeOfDayInMs } from 'sales-modal/utils/enrollModal/timeSelectorUtils';

function updateFirstStepTimeIfSendingImmediately(sequenceEnrollment) {
  var firstSendType = sequenceEnrollment.firstSendType,
      startingStepOrder = sequenceEnrollment.startingStepOrder;
  var firstEditableStepIndex = getFirstEditableStepIndex(sequenceEnrollment);

  if (firstSendType !== SEND_IMMEDIATELY || firstEditableStepIndex < startingStepOrder) {
    return sequenceEnrollment;
  }

  var currentMoment = I18n.moment().tz(sequenceEnrollment.get('timezone'));
  var currentTimeOfDay = getCurrentTimeOfDayInMs(currentMoment);
  return sequenceEnrollment.setIn(['steps', startingStepOrder, 'timeOfDay'], currentTimeOfDay);
}

function setTimezoneFields(sequenceEnrollment, timezone) {
  return sequenceEnrollment.withMutations(function (_sequenceEnrollment) {
    return _sequenceEnrollment.set('timezone', timezone).setIn(['sequenceSettings', 'timeZone'], timezone);
  });
}

export default function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      timezone = _ref.timezone,
      enrollType = _ref.enrollType;
  var updatedEnrollment = updateFirstStepTimeIfSendingImmediately(setTimezoneFields(sequenceEnrollment, timezone));
  return validateDates({
    enrollType: enrollType,
    sequenceEnrollment: updatedEnrollment
  });
}