'use es6';

import { Map as ImmutableMap } from 'immutable';
import { put, post } from 'crm_data/api/ImmutableAPI';
import User from 'hub-http-shims/UserDataJS/user';
import { decodeSettingsValue, encodeSettingsValue } from 'crm_data/settings/UserSettingsSerialization';
export var USER_SETTINGS_API = 'users/v1/app/attributes';
export var USER_SETTINGS_BULK_GET_API = 'users/v1/app/attributes/bulk-get';
export function getUserId() {
  return User.then(function (user) {
    return user.get('user_id');
  });
}
export function normalizeUserSettingsResponse(rawSettings) {
  return rawSettings.attributes.reduce(function (acc, setting) {
    return Object.prototype.hasOwnProperty.call(setting, 'key') && Object.prototype.hasOwnProperty.call(setting, 'value') ? acc.set(setting.key, decodeSettingsValue(setting.value)) : acc;
  }, ImmutableMap());
}
export function fetchUserSetting(keys) {
  return getUserId().then(function (userId) {
    return put(USER_SETTINGS_BULK_GET_API, {
      keys: keys.toArray(),
      user_id: userId
    }, normalizeUserSettingsResponse);
  });
}
export function saveUserSetting(key, value) {
  return getUserId().then(function (userId) {
    var uriKey = encodeURIComponent(key);
    var uriUserId = encodeURIComponent(userId);

    try {
      var encodedValue = encodeSettingsValue(value);
      return post(USER_SETTINGS_API + "?key=" + uriKey + "&user_id=" + uriUserId, {
        key: key,
        value: encodedValue
      });
    } catch (error) {
      return Promise.reject(error);
    }
  });
}