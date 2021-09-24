'use es6';

import { fromJS, Map as ImmutableMap } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
import memoize from 'transmute/memoize';
import { stringify } from 'hub-http/helpers/params';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
var SEARCH_API_BASE = 'contacts/search/v1/search/';

var getBodyParams = function getBodyParams() {
  return ImmutableMap({
    formSubmissionMode: ['none'],
    identityProfileMode: ['all'],
    propertyMode: ['value_only'],
    resolveAssociations: [false],
    resolveOwner: [false],
    showAnalyticsDetails: [false],
    showListMemberships: [false],
    showPastListMemberships: [false],
    showPublicToken: [false],
    showSourceMetadata: [false]
  });
};

var getQueryParamStr = function getQueryParamStr() {
  return stringify(getBodyParams().map(function (value) {
    return value[0];
  }).toJS());
};

var buildUrl = function buildUrl(url) {
  for (var _len = arguments.length, rawParams = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rawParams[_key - 1] = arguments[_key];
  }

  var params = rawParams.filter(function (p) {
    return !!p;
  });
  return params.length ? url + "?" + params.join('&') : url;
};

var getNormalizer = function getNormalizer() {
  var idAccessor = ContactRecord._idKey;
  return function () {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap();
    return data.toList().map(function (obj) {
      return obj.getIn(idAccessor);
    });
  };
};

var getSearchResultsHandler = function getSearchResultsHandler() {
  var dataKey = 'contacts';
  return function (data) {
    var normalize = getNormalizer();
    return fromJS(data).updateIn([dataKey], normalize).set('_results', data.getIn([dataKey]));
  };
};

var getApiUrls = memoize(function () {
  var queryString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return buildUrl(SEARCH_API_BASE + "contacts", getQueryParamStr(), queryString);
});

var elasticSearchApiUrl = function elasticSearchApiUrl(queryParams) {
  return getApiUrls(stringify(queryParams));
};

var fetchSearchResults = function fetchSearchResults(searchQuery, queryParams) {
  return apiClient.post(elasticSearchApiUrl(queryParams), {
    data: searchQuery.toJS(),
    timeout: 60000
  }).then(fromJS).then(getSearchResultsHandler());
};

export var contactsSearchRequest = function contactsSearchRequest(searchQuery, queryParams) {
  return fetchSearchResults(searchQuery, queryParams);
};