'use es6';

import { Map as ImmutableMap } from 'immutable';
import http from 'hub-http/clients/apiClient';
import { getBuilderOnboardingCompletedKey } from 'SequencesUI/constants/UserAttributeKeys';
var userAttributesPath = 'users/v1/app/attributes';
export function searchUsers(_ref) {
  var _ref$searchQuery = _ref.searchQuery,
      searchQuery = _ref$searchQuery === void 0 ? '' : _ref$searchQuery,
      _ref$offset = _ref.offset,
      offset = _ref$offset === void 0 ? 0 : _ref$offset,
      _ref$limit = _ref.limit,
      limit = _ref$limit === void 0 ? 20 : _ref$limit;
  return http.put("users-search/v1/users-search/app/search", {
    data: {
      searchQuery: searchQuery,
      offset: offset,
      limit: limit
    }
  });
}
export function getUsersById(ids) {
  return http.get('users/v1/app/hub-users', {
    query: {
      ids: ids
    }
  });
}
export function getUserAttributes() {
  return http.get(userAttributesPath, {
    query: {
      keys: [getBuilderOnboardingCompletedKey()]
    }
  }).then(function (_ref2) {
    var attributes = _ref2.attributes;
    return attributes.reduce(function (attributeMap, _ref3) {
      var key = _ref3.key,
          value = _ref3.value;
      return attributeMap.set(key, value);
    }, ImmutableMap());
  });
}
export function setUserAttribute(_ref4) {
  var key = _ref4.key,
      value = _ref4.value;
  return http.post(userAttributesPath, {
    data: {
      key: key,
      value: value
    }
  });
}