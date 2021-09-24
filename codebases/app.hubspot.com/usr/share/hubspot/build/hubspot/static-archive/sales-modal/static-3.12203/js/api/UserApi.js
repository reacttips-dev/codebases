'use es6';

import { Map as ImmutableMap } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
export function getUserAttributes(keys) {
  return apiClient.get('users/v1/app/attributes', {
    query: {
      keys: keys
    }
  }).then(function (_ref) {
    var attributes = _ref.attributes;
    return attributes.reduce(function (attributeMap, _ref2) {
      var key = _ref2.key,
          value = _ref2.value;
      return attributeMap.set(key, value);
    }, ImmutableMap());
  });
}
export function setUserAttribute(_ref3) {
  var key = _ref3.key,
      value = _ref3.value;
  return apiClient.post('users/v1/app/attributes', {
    data: {
      key: key,
      value: value
    }
  });
}