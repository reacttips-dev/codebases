'use es6';

import { Record, List, Map as ImmutableMap } from 'immutable';
var PAGE_SIZE = 20;
var ProductQuery = new Record({
  search: '',
  offset: 0,
  count: PAGE_SIZE,
  sorts: List([ImmutableMap({
    property: 'createdate',
    order: 'DESC'
  })]),
  filterGroups: List()
});
export default ProductQuery;