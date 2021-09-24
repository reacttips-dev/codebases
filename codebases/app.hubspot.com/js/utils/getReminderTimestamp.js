'use es6';

import { getDefaultReminder } from 'task-forms-lib/utils/TaskDefaults';

var isCustomDate = function isCustomDate(category) {
  return typeof category === 'number';
};

export var getReminderTimestamp = function getReminderTimestamp(reminder, dueTimestamp) {
  if (isCustomDate(reminder)) {
    return reminder;
  }

  return getDefaultReminder(reminder, dueTimestamp);
};