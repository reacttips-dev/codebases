'use es6';

import { Record, List, Map as ImmutableMap } from 'immutable';
export var PAGE_SIZES = [25, 50, 100];
export var SequenceSearchQuery = Record({
  count: PAGE_SIZES[0],
  offset: 0,
  query: '',
  filterGroups: List([ImmutableMap({
    filters: List()
  })]),
  sorts: List(),
  timeFilter: null
}, 'SequenceSearchQuery');
export var SequenceSearchFilter = Record({
  property: null,
  operator: 'IN',
  values: List(),
  value: null,
  highValue: null
}, 'SequenceSearchFilter');
export var SequenceSearchSort = Record({
  property: null,
  order: 'ASC'
}, 'SequenceSearchSort');