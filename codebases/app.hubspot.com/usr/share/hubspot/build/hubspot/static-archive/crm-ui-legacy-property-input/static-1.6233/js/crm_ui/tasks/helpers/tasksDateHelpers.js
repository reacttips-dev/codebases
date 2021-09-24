'use es6';

import I18n from 'I18n';
import pipe from 'transmute/pipe';
import { secondsToMilliseconds, minutesToSeconds, hoursToMinutes } from '../../utils/dateHelpers';
export var defaultDueDateHours = 8;
export var defaultReminderHours = 8;
var defaultDueDateMinutes = hoursToMinutes(defaultDueDateHours);
export var defaultDueDateMilliseconds = pipe(minutesToSeconds, secondsToMilliseconds)(defaultDueDateMinutes);
export var setToDefaultDueDate = function setToDefaultDueDate() {
  var momentDate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : I18n.moment.userTz();
  return momentDate.startOf('day').add(defaultDueDateHours, 'hours');
};
export var setToDefaultReminderDate = function setToDefaultReminderDate() {
  var momentDate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : I18n.moment.userTz();
  return momentDate.startOf('day').add(defaultReminderHours, 'hours');
};