'use es6';

import http from 'hub-http/clients/apiClient';
import { formatOwners, formatOwnersPaged } from 'reference-resolvers/formatters/formatOwners';
import formatUsers from 'reference-resolvers/formatters/formatUsers';
import { Map as ImmutableMap } from 'immutable';
var BASE_URL = 'owners/v2/owners';

var formatResponse = function formatResponse(response) {
  return ImmutableMap({
    owners: formatOwners(response),
    users: formatUsers(response)
  });
};

export var createGetAllOwners = function createGetAllOwners(_ref) {
  var httpClient = _ref.httpClient;
  return function () {
    return httpClient.get(BASE_URL, {
      query: {
        contactsOnly: true
      }
    }).then(formatResponse);
  };
};
export var getAllOwners = createGetAllOwners({
  httpClient: http
});
export var createGetOwnersById = function createGetOwnersById(_ref2) {
  var httpClient = _ref2.httpClient;
  return function (ids) {
    return httpClient.get(BASE_URL + "/batch", {
      query: {
        ownerId: ids
      }
    }).then(function (response) {
      return formatOwners(ImmutableMap(response).toList());
    });
  };
};
export var getOwnersById = createGetOwnersById({
  httpClient: http
});
export var createFetchOwnersSearchPage = function createFetchOwnersSearchPage(_ref3) {
  var httpClient = _ref3.httpClient;
  return function (props) {
    var _props$toJS = props.toJS(),
        count = _props$toJS.count,
        includeInactive = _props$toJS.includeInactive,
        includeSignature = _props$toJS.includeSignature,
        offset = _props$toJS.offset,
        query = _props$toJS.query;

    return httpClient.get(BASE_URL + "/search", {
      query: {
        includeInactive: includeInactive || false,
        limit: count,
        offset: offset || 0,
        search: query,
        includeSignature: includeSignature || false
      }
    });
  };
};
export var fetchOwnersSearchPage = createFetchOwnersSearchPage({
  httpClient: http
});
export var createGetOwnersSearchPage = function createGetOwnersSearchPage(options) {
  return function (props) {
    var fetchFn = createFetchOwnersSearchPage(options);
    return fetchFn(props).then(formatOwnersPaged);
  };
};
export var getOwnersSearchPage = function getOwnersSearchPage(props) {
  return fetchOwnersSearchPage(props).then(formatOwnersPaged);
};