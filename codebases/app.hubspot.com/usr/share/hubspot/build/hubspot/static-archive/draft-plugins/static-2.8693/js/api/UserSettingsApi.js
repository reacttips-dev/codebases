'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import http from 'hub-http/clients/apiClient';
import userInfo from 'hub-http/userInfo';
var BASE_URI = 'users/v1/app/attributes';
var BULK_GET_URI = BASE_URI + "/bulk-get";
export function fetchUserSetting(keys) {
  return userInfo().then(function (_ref) {
    var user = _ref.user;
    var formattedKeys = Array.isArray(keys) ? keys : [keys];
    return http.put(BULK_GET_URI, {
      data: {
        keys: formattedKeys,
        user_id: user.user_id
      }
    }).then(function (settings) {
      return settings.attributes.reduce(function (acc, setting) {
        if (!(setting && setting.value)) {
          return acc;
        }

        var parsedSetting = JSON.parse(setting.value);
        return Object.assign({}, acc, {}, parsedSetting);
      }, {});
    });
  });
}
export function saveUserSetting(settingName, key, value) {
  return userInfo().then(function (_ref2) {
    var user = _ref2.user;
    var uriKey = encodeURIComponent(settingName);
    var uriUserId = encodeURIComponent(user.user_id);
    return http.post(BASE_URI + "?key=" + uriKey + "&user_id=" + uriUserId, {
      data: {
        key: uriKey,
        value: JSON.stringify(_defineProperty({}, key, value))
      }
    });
  });
}