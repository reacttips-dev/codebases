'use es6';

import { fromJS } from 'immutable';
import { TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { decorateQueryResult } from 'crm_data/crmSearch/esAdapter';
var DEFAULT_QUERY = fromJS({
  count: 10,
  filterGroups: [],
  offset: 0,
  sorts: []
});
var DEFAULT_SORT = fromJS({
  order: 'DESC',
  property: 'createdate'
});
var TicketsSearchAPIQuery = {
  default: function _default(query) {
    var result = DEFAULT_QUERY.merge(fromJS(query)).updateIn(['sorts'], function (sorts) {
      return sorts.push(DEFAULT_SORT);
    });
    return decorateQueryResult({
      objectType: TICKET,
      query: result
    });
  },
  associatedTickets: function associatedTickets(objectType, subjectId, count, query) {
    return fromJS({
      filterGroups: [{
        filters: [{
          operator: 'EQ',
          property: "associations." + objectType.toLowerCase(),
          value: subjectId
        }]
      }],
      count: count,
      offset: 0,
      query: query
    });
  }
};
export default TicketsSearchAPIQuery;