'use es6';

import { Map as ImmutableMap } from 'immutable';
import get from 'transmute/get';
import { formatToReferencesList } from 'reference-resolvers/lib/formatReferences';
export var formatWorkflows = formatToReferencesList({
  getId: get('flowId'),
  // `name` should always be available on the object, but historically was not
  // required, so to be 100% safe from providing nothing use `flowId` as a fallback
  getLabel: function getLabel(workflow) {
    return get('name', workflow) || "" + get('flowId', workflow);
  }
});
export var formatWorkflowsPaged = function formatWorkflowsPaged(response) {
  var results = response.results,
      offset = response.offset,
      hasMore = response.hasMore;
  return ImmutableMap({
    count: results.length,
    hasMore: hasMore,
    results: formatWorkflows(results),
    offset: offset || 0
  });
};