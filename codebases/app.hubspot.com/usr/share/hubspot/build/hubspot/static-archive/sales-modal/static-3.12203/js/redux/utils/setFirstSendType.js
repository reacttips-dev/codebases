'use es6';

import I18n from 'I18n';
import { SEND_IMMEDIATELY } from 'sales-modal/constants/FirstSendTypes';
import { getCurrentTimeOfDayInMs } from 'sales-modal/utils/enrollModal/timeSelectorUtils';
import getFirstEditableStepIndex from 'sales-modal/utils/enrollModal/getFirstEditableStepIndex';
import calculateDayDelay from 'sales-modal/utils/enrollModal/calculateDayDelay';
export default function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      firstSendType = _ref.firstSendType,
      enrollType = _ref.enrollType;
  var startingStepOrder = sequenceEnrollment.startingStepOrder;

  if (firstSendType !== SEND_IMMEDIATELY) {
    return sequenceEnrollment.set('firstSendType', firstSendType);
  }

  var currentMoment = I18n.moment().tz(sequenceEnrollment.get('timezone'));
  var currentTimeOfDay = getCurrentTimeOfDayInMs(currentMoment);
  var firstEditableStepIndex = getFirstEditableStepIndex(sequenceEnrollment);

  if (firstEditableStepIndex === startingStepOrder) {
    return sequenceEnrollment.setIn(['steps', startingStepOrder, 'timeOfDay'], currentTimeOfDay).merge({
      firstSendType: firstSendType,
      initialTouchDelay: 0
    });
  }

  var delay = calculateDayDelay(sequenceEnrollment, currentMoment.tz(sequenceEnrollment.get('timezone')), enrollType);
  return sequenceEnrollment.set('firstSendType', firstSendType).updateIn(['steps', firstEditableStepIndex], function (step) {
    return step.merge({
      delay: delay,
      timeOfDay: currentTimeOfDay
    });
  });
}