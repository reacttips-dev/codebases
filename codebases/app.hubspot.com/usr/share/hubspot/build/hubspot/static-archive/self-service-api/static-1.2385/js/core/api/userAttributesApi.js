'use es6';

import http from 'hub-http/clients/apiClient';
import memoize from '../utilities/memoize';
var URL = "users/v1/app/attributes";
export var fetchUserAttributes = memoize(function (optionalKey) {
  var queryString = '';

  if (optionalKey) {
    queryString = "?key=" + optionalKey;
  }

  return http.get("" + URL + queryString);
});
export var setUserAttribute = function setUserAttribute(key, value) {
  return http.post(URL, {
    data: {
      key: key,
      value: value
    }
  });
};