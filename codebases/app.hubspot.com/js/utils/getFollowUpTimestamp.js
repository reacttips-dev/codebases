'use es6';

import { minutesToMilliseconds } from './dateUtils';
import { getDefaultDueDate } from 'task-forms-lib/utils/TaskDefaults';

var isCustomDate = function isCustomDate(category) {
  return typeof category === 'number';
};

export var getFollowUpTimestamp = function getFollowUpTimestamp(selectedDate) {
  var selectedTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (isCustomDate(selectedDate)) {
    return selectedDate + minutesToMilliseconds(selectedTime);
  }

  return getDefaultDueDate(selectedDate.value, selectedTime);
};