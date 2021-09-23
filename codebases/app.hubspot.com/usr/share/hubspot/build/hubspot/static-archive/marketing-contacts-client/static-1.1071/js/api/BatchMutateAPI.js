'use es6';

import invariant from 'react-utils/invariant';
import { userInfoSync } from 'hub-http/userInfo';
import http from 'hub-http/clients/apiClient';

var isObject = function isObject(value) {
  return typeof value === 'object' && value !== null;
};

var isNumber = function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
};

var _enforceIdList = function _enforceIdList(query) {
  return query.map(function (id) {
    return invariant(isNumber(id), 'expected method to be a number but got "%s" instead', typeof id);
  });
}; // Use post() for full control, or update()/delete() for convenience.
// "query" can be a contactsSearch object or an array of IDs (numbers only)


var BatchMutateAPI = {
  post: function post(_ref) {
    var query = _ref.query,
        applyToAll = _ref.applyToAll,
        expectedNumberObjectsModified = _ref.expectedNumberObjectsModified,
        marketableStatusType = _ref.marketableStatusType,
        source = _ref.source;
    var payload = {
      type: 'UPDATE',
      applyToAll: applyToAll,
      expectedNumberObjectsModified: expectedNumberObjectsModified,
      batchMutationRequestAddOnData: {
        marketableStatusType: marketableStatusType
      }
    };

    if (Array.isArray(query)) {
      _enforceIdList(query);

      payload.objectIdList = query;
    } else if (isObject(query)) {
      payload.contactsSearch = query;
    } else {
      invariant(Array.isArray(query) || isObject(query), 'expected query to be an array or object but got "%s" instead', query);
    }

    var _userInfoSync = userInfoSync(),
        email = _userInfoSync.user.email;

    return http.post("contacts/v1/mutation", {
      data: payload,
      headers: {
        'X-Properties-Source': source,
        'X-Properties-SourceId': email
      }
    });
  }
};
export default BatchMutateAPI;