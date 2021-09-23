'use es6';

import { SEND_TEMPLATE } from 'sales-modal/constants/SequenceStepTypes';
import { timeInputToTimeOfDay } from 'sales-modal/utils/enrollModal/timeSelectorUtils';
import randomInterval from 'sales-modal/utils/enrollModal/randomInterval';
export function setEmailSendTimesFromRange(_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      start = _ref.start,
      end = _ref.end,
      _ref$interval = _ref.interval,
      interval = _ref$interval === void 0 ? randomInterval : _ref$interval;
  var steps = sequenceEnrollment.steps,
      startingStepOrder = sequenceEnrollment.startingStepOrder;
  var updateSteps = steps.map(function (step, index) {
    if (index === startingStepOrder || step.get('action') !== SEND_TEMPLATE) {
      return step;
    }

    var randomTimeOfDay = interval({
      start: start,
      end: end
    });
    var updatedTimeOfDay = timeInputToTimeOfDay(randomTimeOfDay);
    return step.set('timeOfDay', updatedTimeOfDay);
  });
  return sequenceEnrollment.set('steps', updateSteps);
}
export default setEmailSendTimesFromRange;