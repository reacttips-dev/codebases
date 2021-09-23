'use es6';

import I18n from 'I18n';
import { SEND_IMMEDIATELY } from 'sales-modal/constants/FirstSendTypes';
import { getCurrentTimeOfDayInMs } from 'sales-modal/utils/enrollModal/timeSelectorUtils';
export default function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      startingStepOrder = _ref.startingStepOrder;
  var firstSendType = sequenceEnrollment.firstSendType;
  var updatedEnrollment = sequenceEnrollment.set('startingStepOrder', startingStepOrder);

  if (firstSendType !== SEND_IMMEDIATELY) {
    return updatedEnrollment;
  }

  return updatedEnrollment.setIn(['steps', startingStepOrder, 'timeOfDay'], getCurrentTimeOfDayInMs(I18n.moment().tz(sequenceEnrollment.get('timezone')))).set('initialTouchDelay', 0);
}