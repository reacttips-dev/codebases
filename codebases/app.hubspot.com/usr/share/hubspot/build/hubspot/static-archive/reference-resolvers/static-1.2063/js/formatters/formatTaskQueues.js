'use es6';

import { fromJS } from 'immutable';
import getIn from 'transmute/getIn';
import { formatToReferencesList } from 'reference-resolvers/lib/formatReferences';
var formatTaskQueueId = getIn(['definition', 'id']);
var formatTaskQueueLabel = getIn(['definition', 'name']);
export var formatTaskQueuesReferenceList = formatToReferencesList({
  getId: formatTaskQueueId,
  getLabel: formatTaskQueueLabel
}); // Usage: formatTaskQueuesReferenceList(queueResults)

export var formatTaskQueuesSearchResponse = function formatTaskQueuesSearchResponse(results) {
  return fromJS({
    count: results.length,
    hasMore: false,
    offset: 0,
    results: formatTaskQueuesReferenceList(results)
  });
};