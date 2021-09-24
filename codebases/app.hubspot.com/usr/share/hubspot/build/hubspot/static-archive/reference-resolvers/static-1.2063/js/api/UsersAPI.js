'use es6';

import http from 'hub-http/clients/apiClient';
import { formatOwners } from 'reference-resolvers/formatters/formatOwners';
import formatUsers from 'reference-resolvers/formatters/formatUsers';
import { formatUsersV2Map } from 'reference-resolvers/formatters/formatUsersV2';
import { formatUsersSearchPaged } from 'reference-resolvers/formatters/formatUsersSearch';
import { Map as ImmutableMap } from 'immutable';
import get from 'transmute/get';

var formatResponse = function formatResponse(response) {
  return ImmutableMap({
    owners: formatOwners(response),
    users: formatUsers(response)
  });
};

export var createGetAllUsers = function createGetAllUsers(_ref) {
  var httpClient = _ref.httpClient;
  return function () {
    return httpClient.get('owners/v2/owners', {
      query: {
        contactsOnly: true
      }
    }).then(formatResponse);
  };
};
export var getAllUsers = createGetAllUsers({
  httpClient: http
});
export var createGetUsersByIds = function createGetUsersByIds(_ref2) {
  var httpClient = _ref2.httpClient;
  return function (ids) {
    return httpClient.put('users/v2/app/hub-users/bulk', {
      data: ids,
      query: {
        limit: ids.length
      }
    }).then(get('userBriefs')).then(formatUsersV2Map);
  };
};
export var getUsersByIds = createGetUsersByIds({
  httpClient: http
});
export var createFetchUsersSearchPage = function createFetchUsersSearchPage(_ref3) {
  var httpClient = _ref3.httpClient;
  return function (props) {
    var _props$toJS = props.toJS(),
        count = _props$toJS.count,
        offset = _props$toJS.offset,
        query = _props$toJS.query;

    return httpClient.put('users-search/v1/users-search/app/search', {
      data: {
        limit: count,
        offset: offset,
        searchQuery: query
      }
    });
  };
};
export var fetchUsersSearchPage = createFetchUsersSearchPage({
  httpClient: http
});
export var createGetUsersSearchPage = function createGetUsersSearchPage(options) {
  var getter = createFetchUsersSearchPage(options);
  return function (props) {
    return getter(props).then(formatUsersSearchPaged);
  };
};
export var getUsersSearchPage = function getUsersSearchPage(props) {
  return fetchUsersSearchPage(props).then(formatUsersSearchPaged);
};