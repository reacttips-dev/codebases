'use es6';

import { decorateQueryResult } from 'crm_data/crmSearch/esAdapter';
import { fromJS } from 'immutable';
import { DEAL } from 'customer-data-objects/constants/ObjectTypes';
var DEFAULT_QUERY = fromJS({
  offset: 0,
  count: 10,
  filterGroups: [],
  sorts: []
});
var DEFAULT_SORT = fromJS({
  property: 'dealId',
  order: 'DESC'
});
var DealsSearchAPIQuery = {
  default: function _default(query) {
    var result = DEFAULT_QUERY.merge(fromJS(query)).updateIn(['sorts'], function (sorts) {
      return sorts.push(DEFAULT_SORT);
    });
    return decorateQueryResult({
      objectType: DEAL,
      query: result
    });
  },
  associatedDeal: function associatedDeal(objectType, subjectId, count, query) {
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
export default DealsSearchAPIQuery;