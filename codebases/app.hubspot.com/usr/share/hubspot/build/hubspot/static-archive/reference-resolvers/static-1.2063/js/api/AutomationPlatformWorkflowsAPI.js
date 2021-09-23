'use es6';

import http from 'hub-http/clients/apiClient';
import { formatWorkflows, formatWorkflowsPaged } from 'reference-resolvers/formatters/formatWorkflows';
var BASE_URL = 'automationplatform/v1/flows';
export var createGetWorkflowsByIds = function createGetWorkflowsByIds(_ref) {
  var httpClient = _ref.httpClient;
  return function (ids) {
    return httpClient.post(BASE_URL + "/ids/fetch", {
      data: ids
    }).then(function (flows) {
      return Object.keys(flows).map(function (key) {
        return flows[key];
      });
    }).then(formatWorkflows);
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

    var querystring = {
      name: query,
      limit: count,
      offset: offset
    };
    return httpClient.get(BASE_URL, {
      query: querystring
    }).then(formatWorkflowsPaged);
  };
};
export var getWorkflowsSearchPage = createGetWorkflowsSearchPage({
  httpClient: http
});