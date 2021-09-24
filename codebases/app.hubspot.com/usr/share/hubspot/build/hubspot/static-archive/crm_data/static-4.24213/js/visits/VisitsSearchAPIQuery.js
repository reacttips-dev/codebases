'use es6';

import { fromJS } from 'immutable';
var DEFAULT_QUERY = fromJS({
  offset: 0,
  count: 10,
  filterGroups: [],
  sorts: []
});
var DEFAULT_SORT = fromJS({
  property: 'domain',
  order: 'DESC'
});
var VisitsSearchAPIQuery = {
  default: function _default(query) {
    return DEFAULT_QUERY.merge(fromJS(query)).updateIn(['sorts'], function (sorts) {
      return sorts.push(DEFAULT_SORT);
    });
  }
};
export default VisitsSearchAPIQuery;