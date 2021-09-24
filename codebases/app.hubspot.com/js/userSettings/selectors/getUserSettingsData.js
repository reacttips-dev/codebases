'use es6';

import get from 'transmute/get';
import { createSelector } from 'reselect';
import { COUNTRY_UNSUPPORTED_WARNING_CLOSED, SHOW_SUSPENDED_WARNING_MESSAGE } from '../constants/UserSettingsKeys';
export var getUserSettingsAsyncDataFromState = get('userSettings');
export var getUserSettings = createSelector([getUserSettingsAsyncDataFromState], get('data'));
export var getShowSuspendedWarningMessage = createSelector([getUserSettings], function (userSettings) {
  return userSettings.get(SHOW_SUSPENDED_WARNING_MESSAGE) === 'true';
});
export var getShowCountryUnsupportedWarning = createSelector([getUserSettings], function (userSettings) {
  if (!userSettings.size) {
    return false;
  }

  return userSettings.get(COUNTRY_UNSUPPORTED_WARNING_CLOSED) !== 'true';
});
export var getDefaultTaskSettings = createSelector([getUserSettings], function (userSettings) {
  if (!userSettings || !userSettings.size) {
    return {};
  }

  var DEFAULT_DUE_DATE_PRESET_KEY = 'Tasks:Defaults:DueDatePreset';
  var DEFAULT_DUE_TIME_KEY = 'Tasks:Defaults:DueTime';
  var DEFAULT_REMINDER_PRESET_KEY = 'Tasks:Defaults:ReminderPreset';
  var defaultDueDatePreset = userSettings.get(DEFAULT_DUE_DATE_PRESET_KEY);
  var defaultDueTime = userSettings.get(DEFAULT_DUE_TIME_KEY);
  var defaultReminderPreset = userSettings.get(DEFAULT_REMINDER_PRESET_KEY);
  return {
    defaultDueDatePreset: defaultDueDatePreset ? JSON.parse(defaultDueDatePreset) : null,
    defaultDueTime: defaultDueTime ? JSON.parse(defaultDueTime) : null,
    defaultReminderPreset: defaultReminderPreset ? JSON.parse(defaultReminderPreset) : null
  };
});