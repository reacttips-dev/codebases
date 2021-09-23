'use es6';

import http from 'hub-http/clients/apiClient';
import { formatToReferencesList } from 'reference-resolvers/lib/formatReferences';
import get from 'transmute/get';
import { Map as ImmutableMap, fromJS } from 'immutable';
var BASE_URL = 'automation/v3/workflows';
var formatWorkflows = formatToReferencesList({
  getId: get('id'),
  getLabel: get('name')
});
export var createGetWorkflowsByIds = function createGetWorkflowsByIds(_ref) {
  var httpClient = _ref.httpClient;
  return function (ids) {
    return httpClient.put(BASE_URL + "/batch", {
      data: ids
    }).then(get('workflows')).then(formatWorkflows);
  };
};
export var getWorkflowsByIds = createGetWorkflowsByIds({
  httpClient: http
});
export var createGetWorkflowsSearchPage = function createGetWorkflowsSearchPage(_ref2) {
  var httpClient = _ref2.httpClient;
  return function (props) {
    var _props$toJS = props.toJS(),
        count = _props$toJS.count,
        offset = _props$toJS.offset,
        query = _props$toJS.query;

    return httpClient.get(BASE_URL + "/search", {
      query: {
        limit: count,
        offset: offset || 0,
        q: query
      }
    }).then(function (response) {
      var hasMore = false;
      var responseCount = response.length;
      var responseOffset = 0;
      var total = response.length;
      var results = formatWorkflows(fromJS(response));
      return ImmutableMap({
        hasMore: hasMore,
        offset: responseOffset,
        count: responseCount,
        total: total,
        results: results
      });
    });
  };
};
export var getWorkflowsSearchPage = createGetWorkflowsSearchPage({
  httpClient: http
});
export var createGetAllWorkflows = function createGetAllWorkflows(_ref3) {
  var httpClient = _ref3.httpClient;
  return function () {
    return httpClient.get(BASE_URL + "/?stats=false&property=name&property=id&property=enabled").then(function (results) {
      return formatToReferencesList({
        getId: get('id'),
        getLabel: get('name')
      }, results.workflows);
    });
  };
};
export var getAllWorkflows = createGetAllWorkflows({
  httpClient: http
});