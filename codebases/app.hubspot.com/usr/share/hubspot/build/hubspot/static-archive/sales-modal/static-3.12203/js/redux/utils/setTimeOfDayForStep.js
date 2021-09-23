'use es6';

import { timeInputToTimeOfDay } from 'sales-modal/utils/enrollModal/timeSelectorUtils';
export default function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      step = _ref.step,
      timeValue = _ref.timeValue;
  var stepOrder = step.get('stepOrder');
  var timeOfDayPath = ['steps', stepOrder, 'timeOfDay'];
  var updatedTimeOfDay = timeInputToTimeOfDay(timeValue);
  return sequenceEnrollment.setIn(timeOfDayPath, updatedTimeOfDay);
}