'use es6';

import http from 'hub-http/clients/apiClient';
import { Map as ImmutableMap } from 'immutable';
import User from 'hub-http-shims/UserDataJS/user';
/**
 * The backend enforces a character limit each value.
 */

var MAX_DATA_LENGTH = 1000;
export function encodeSettingsValue(value) {
  var length = typeof value === 'string' ? value.length : 0;

  if (length > MAX_DATA_LENGTH) {
    var error = new Error("Expected encodedValue.length to be less than " + MAX_DATA_LENGTH);
    throw error;
  }

  return JSON.stringify(value);
}
export function normalizeUserSettingsResponse(rawSettings) {
  return rawSettings.attributes.reduce(function (acc, setting) {
    return Object.prototype.hasOwnProperty.call(setting, 'key') && Object.prototype.hasOwnProperty.call(setting, 'value') ? acc.set(setting.key, setting.value) : acc;
  }, ImmutableMap());
}
export function fetchUserSettingsAPI(keys) {
  return http.put('users/v1/app/attributes/bulk-get', {
    data: {
      keys: keys
    }
  }).then(normalizeUserSettingsResponse);
}

function getUserId() {
  return User.then(function (user) {
    return user.get('user_id');
  });
}

export function saveUserSettingAPI(_ref) {
  var key = _ref.key,
      value = _ref.value;
  return getUserId().then(function (userId) {
    var uriKey = encodeURIComponent(key);
    var uriUserId = encodeURIComponent(userId);

    try {
      var encodedValue = encodeSettingsValue(value);
      return http.post("users/v1/app/attributes?key=" + uriKey + "&user_id=" + uriUserId, {
        data: {
          key: key,
          value: encodedValue
        }
      });
    } catch (error) {
      return Promise.reject(error);
    }
  });
}