'use es6';

import getIn from 'transmute/getIn';
import { fromJS, List, Map as ImmutableMap } from 'immutable';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';

var formatInboundDbList = function formatInboundDbList(list) {
  return new ReferenceRecord({
    id: getIn(['properties', 'hs_list_id', 'value'], list),
    label: getIn(['properties', 'hs_list_name', 'value'], list),
    referencedObject: fromJS(list)
  });
};

var formatInboundDbListSegments = function formatInboundDbListSegments(response) {
  var count = response.count,
      hasMore = response.hasMore,
      offset = response.offset,
      results = response.results,
      total = response.total;
  return ImmutableMap({
    count: count,
    hasMore: hasMore,
    offset: offset,
    results: List(results).map(formatInboundDbList),
    total: total
  });
};

export default formatInboundDbListSegments;