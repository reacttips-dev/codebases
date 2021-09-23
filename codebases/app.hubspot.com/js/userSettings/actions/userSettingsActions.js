'use es6';

import { createAsyncAction } from 'conversations-async-data/async-action/createAsyncAction';
import { fromJS } from 'immutable';
import { FETCH_USER_SETTINGS, SAVE_USER_SETTING } from './asyncActionTypes';
import { logCallingError } from 'calling-error-reporting/report/error';
import { fetchUserSettingsAPI, saveUserSettingAPI } from 'calling-lifecycle-internal/user-settings/clients/userSettingsClient';
export var toRecordFn = function toRecordFn(response) {
  try {
    return fromJS(response);
  } catch (e) {
    logCallingError({
      errorMessage: 'Error Parsing data from User Settings request',
      extraData: {
        error: e
      }
    });
    return null;
  }
};
export var getUserSettings = createAsyncAction({
  actionTypes: FETCH_USER_SETTINGS,
  requestFn: function requestFn(requestArgs) {
    return fetchUserSettingsAPI(requestArgs.userSettingsKeys);
  },
  toRecordFn: toRecordFn
});
export var saveUserSetting = createAsyncAction({
  actionTypes: SAVE_USER_SETTING,
  requestFn: saveUserSettingAPI,
  toRecordFn: toRecordFn
});