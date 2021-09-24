'use es6';

import http from 'hub-http/clients/apiClient';
import Raven from 'Raven';
import { UserSettingsErrors } from '../constants/UserSettingsErrors';
import { isSettingsValueTooLong } from '../utils/isSettingsValueTooLong';
var BASE_URL = 'users/v1/app/attributes';
export var setUserSetting = function setUserSetting(_ref) {
  var key = _ref.key,
      value = _ref.value;

  if (isSettingsValueTooLong(value)) {
    Raven.captureMessage('User settings value was too long', {
      extra: {
        key: key
      }
    });
    return Promise.reject(new Error(UserSettingsErrors.TOO_LONG));
  }

  return http.post(BASE_URL + "?key=" + encodeURIComponent(key), {
    data: {
      key: key,
      value: value
    }
  });
};