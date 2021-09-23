'use es6';

import http from 'hub-http/clients/apiClient';
import formatContactLists from 'reference-resolvers/formatters/formatContactLists';
import formatContactSegments from 'reference-resolvers/formatters/formatContactSegments';
export var createGetAllContactLists = function createGetAllContactLists(_ref) {
  var httpClient = _ref.httpClient;
  return function () {
    return httpClient.get('/contacts/v1/lists/internal/all').then(formatContactLists);
  };
};
export var getAllContactLists = createGetAllContactLists({
  httpClient: http
});
export var createGetContactListsByIds = function createGetContactListsByIds(_ref2) {
  var httpClient = _ref2.httpClient;
  return function (ids) {
    return httpClient.get('/contacts/v1/lists/batch', {
      query: {
        listId: ids,
        property: ['listId', 'name', 'dynamic']
      }
    }).then(formatContactLists);
  };
};
export var getContactListsByIds = createGetContactListsByIds({
  httpClient: http
});
export var createGetContactListsSearchPage = function createGetContactListsSearchPage(_ref3) {
  var httpClient = _ref3.httpClient;
  return function (props, extraQueryParams) {
    var _props$toJS = props.toJS(),
        count = _props$toJS.count,
        offset = _props$toJS.offset,
        query = _props$toJS.query;

    return httpClient.get('/contacts/v1/segment-ui/all', {
      query: Object.assign({}, extraQueryParams, {
        count: count,
        direction: 'ASC',
        favorites: false,
        includeTotal: true,
        offset: offset || 0,
        q: query,
        sortBy: 'LIST_NAME'
      })
    }).then(formatContactSegments);
  };
};
export var getContactListsSearchPage = createGetContactListsSearchPage({
  httpClient: http
});
export var createGetStaticContactListsSearchPage = function createGetStaticContactListsSearchPage(options) {
  var getter = createGetContactListsSearchPage(options);
  return function (props) {
    return getter(props, {
      listType: 'STATIC'
    });
  };
};
export var getStaticContactListsSearchPage = function getStaticContactListsSearchPage(props) {
  return getContactListsSearchPage(props, {
    listType: 'STATIC'
  });
};