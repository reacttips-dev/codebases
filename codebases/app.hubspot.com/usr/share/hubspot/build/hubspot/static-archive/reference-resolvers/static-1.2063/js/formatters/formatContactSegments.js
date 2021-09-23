'use es6';

import { List, Map as ImmutableMap, fromJS } from 'immutable';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';

var formatListId = function formatListId(list) {
  return String(list.listId);
};

var formatSegmentReference = function formatSegmentReference(listObj) {
  var list = listObj.list;
  return new ReferenceRecord({
    id: formatListId(list),
    label: list.name,
    referencedObject: fromJS(list)
  });
};

var formatContactSegments = function formatContactSegments(response) {
  var lists = response.lists,
      offset = response.offset,
      count = response.count,
      total = response.total,
      hasMore = response.hasMore;
  return ImmutableMap({
    hasMore: hasMore,
    offset: offset,
    count: count,
    total: total,
    results: List(lists).map(formatSegmentReference)
  });
};

export default formatContactSegments;