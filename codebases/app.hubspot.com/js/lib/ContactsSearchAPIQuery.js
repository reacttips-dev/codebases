'use es6';

import { fromJS } from 'immutable';
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
export function defaultQuery(query) {
  return DEFAULT_QUERY.merge(fromJS(query)).updateIn(['sorts'], function (sorts) {
    return sorts.push(DEFAULT_SORT);
  });
}