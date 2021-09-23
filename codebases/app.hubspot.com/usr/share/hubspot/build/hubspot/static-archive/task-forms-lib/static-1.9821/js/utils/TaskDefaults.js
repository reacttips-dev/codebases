'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { TASK } from 'customer-data-objects/engagement/EngagementTypes';
import { NONE } from 'customer-data-objects/engagement/taskPriorities';
import { TODO } from 'customer-data-objects/engagement/TaskTypes';
import PropertyValueRecord from 'customer-data-objects/property/PropertyValueRecord';
import { DUE_DATE, ENGAGEMENT_TYPE, OWNER_ID, PRIORITY, QUEUE_IDS, RELATIVE_REMINDERS, REMINDERS, TYPE } from 'customer-data-objects/task/TaskPropertyNames';
import TaskRecord from 'customer-data-objects/task/TaskRecord';
import { THREE_BUSINESS_DAYS } from 'customer-data-properties/constants/RelativeDates';
import { datePresetToMoment } from 'customer-data-properties/date/RelativeDatePresets';
import I18n from 'I18n';
import { fromJS } from 'immutable';
var NO_REMINDER = null;
var EIGHT_HOURS_IN_MINUTES = 8 * 60;
export function getPropertyKeyValuePair(name, value) {
  if (!name || value === undefined) return null;
  return _defineProperty({}, name, PropertyValueRecord({
    name: name,
    value: value
  }));
}
export function getDefaultDueDate() {
  var defaultDueDatePreset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : THREE_BUSINESS_DAYS;
  var defaultDueTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EIGHT_HOURS_IN_MINUTES;
  return datePresetToMoment(defaultDueDatePreset).add(defaultDueTime, 'minutes').valueOf();
}
export function getDefaultReminder(defaultReminderPreset) {
  var dueDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getDefaultDueDate();

  if (!defaultReminderPreset) {
    return NO_REMINDER;
  }

  return datePresetToMoment(defaultReminderPreset, I18n.moment.userTz(dueDate)).valueOf();
}
export function getDefaultTask(_ref2) {
  var ownerId = _ref2.ownerId,
      queueId = _ref2.queueId,
      _ref2$timestamp = _ref2.timestamp,
      timestamp = _ref2$timestamp === void 0 ? getDefaultDueDate() : _ref2$timestamp,
      relativeReminder = _ref2.relativeReminder,
      _ref2$reminder = _ref2.reminder,
      reminder = _ref2$reminder === void 0 ? getDefaultReminder() : _ref2$reminder;
  return TaskRecord(fromJS({
    properties: Object.assign({}, getPropertyKeyValuePair(ENGAGEMENT_TYPE, TASK), {}, getPropertyKeyValuePair(OWNER_ID, ownerId), {}, getPropertyKeyValuePair(TYPE, TODO), {}, getPropertyKeyValuePair(PRIORITY, NONE), {}, getPropertyKeyValuePair(DUE_DATE, timestamp), {}, getPropertyKeyValuePair(REMINDERS, reminder), {}, getPropertyKeyValuePair(QUEUE_IDS, queueId), {}, getPropertyKeyValuePair(RELATIVE_REMINDERS, relativeReminder))
  }));
}