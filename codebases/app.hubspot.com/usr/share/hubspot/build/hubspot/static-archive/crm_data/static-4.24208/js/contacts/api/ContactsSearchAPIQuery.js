'use es6';

import { decorateQueryResult } from 'crm_data/crmSearch/esAdapter';
import { fromJS } from 'immutable';
import { CONTACT } from 'customer-data-objects/constants/ObjectTypes';
var DEFAULT_QUERY = fromJS({
  offset: 0,
  count: 10,
  filterGroups: [],
  properties: [],
  sorts: []
});
var DEFAULT_SORT = fromJS({
  property: 'vid',
  order: 'DESC'
});
export function associatedWithCompany(companyId, count, query) {
  return fromJS({
    filterGroups: [{
      filters: [{
        operator: 'EQ',
        property: 'associatedcompanyid',
        value: companyId
      }]
    }],
    count: count,
    query: query
  });
}
export function associatedWithDeal(associatedContactIds, count, query) {
  return fromJS({
    filterGroups: [{
      filters: [{
        operator: 'IN',
        property: 'vid',
        values: associatedContactIds
      }]
    }],
    count: count,
    query: query
  });
}
export function defaultQuery(query) {
  var result = DEFAULT_QUERY.merge(fromJS(query)).updateIn(['sorts'], function (sorts) {
    return sorts.push(DEFAULT_SORT);
  });
  return decorateQueryResult({
    objectType: CONTACT,
    query: result
  });
}