'use es6';

import http from 'hub-http/clients/apiClient';
import { formatToReferencesList } from 'reference-resolvers/lib/formatReferences';
import get from 'transmute/get';
import { Map as ImmutableMap, fromJS, List } from 'immutable';
var formatWorkflows = formatToReferencesList({
  getId: get('id'),
  getLabel: get('name'),
  getDisabled: function getDisabled(value) {
    return get('enabled', value) === false || !get('canEnrollFromSalesforce', value);
  }
});

function getSalesforceWorkflows(httpClient) {
  return httpClient.get('automation/v2/workflows?property=id&property=name&property=enabled&property=canEnrollFromSalesforce').then(function (response) {
    if (!response || !response.workflows) {
      return [];
    }

    return response.workflows;
  });
}

function workflowComparator(a, b) {
  return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
}

function workflowSearchFilter(search) {
  search = search.toUpperCase();
  return function (workflow) {
    if (!search) {
      return true;
    }

    var name = workflow.name.toUpperCase();
    return name.indexOf(search) > -1;
  };
}

export var createGetSalesforceWorkflowsByIds = function createGetSalesforceWorkflowsByIds(_ref) {
  var httpClient = _ref.httpClient;
  return function (ids) {
    return getSalesforceWorkflows(httpClient).then(function (workflows) {
      if (!ids) {
        return workflows;
      }

      return workflows.filter(function (workflow) {
        return ids.indexOf(workflow.id) > -1;
      }).sort(workflowComparator);
    });
  };
};
export var getSalesforceWorkflowsByIds = createGetSalesforceWorkflowsByIds({
  httpClient: http
});
export var createGetSalesforceWorkflowsBySearch = function createGetSalesforceWorkflowsBySearch(_ref2) {
  var httpClient = _ref2.httpClient;
  return function (props) {
    var _props$toJS = props.toJS(),
        query = _props$toJS.query;

    return getSalesforceWorkflows(httpClient).then(function (workflows) {
      var formattedWorkflows = formatWorkflows(fromJS(workflows.filter(workflowSearchFilter(query))));
      var groupedWfs = formattedWorkflows.groupBy(function (_) {
        return _.disabled;
      });
      var hasMore = false;
      var count = workflows.length;
      var offset = 0;
      var total = workflows.length; // Show all the enabled workflows at the top of the dropdown, then sort them

      var results = groupedWfs.get(false, List()).sort(workflowComparator).concat(groupedWfs.get(true, List()).sort(workflowComparator));
      return ImmutableMap({
        hasMore: hasMore,
        offset: offset,
        count: count,
        total: total,
        results: results
      });
    });
  };
};
export var getSalesforceWorkflowsBySearch = createGetSalesforceWorkflowsBySearch({
  httpClient: http
});