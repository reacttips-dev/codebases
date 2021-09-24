'use es6';

import { fromJS } from 'immutable';
import { EMAIL, TASK, MEETING, CALL, NOTE, INCOMING_EMAIL } from 'customer-data-objects/engagement/EngagementTypes';
var DEFAULT_QUERY = fromJS({
  offset: 0,
  count: 10,
  filterGroups: [],
  sorts: []
});
var DEFAULT_FILTER = fromJS({
  operator: 'IN',
  property: 'engagement.type',
  values: [EMAIL, TASK, MEETING, CALL, NOTE, INCOMING_EMAIL]
});
var DEFAULT_SORT = fromJS({
  property: 'engagement.id',
  order: 'DESC'
});
var EngagementsSearchAPIQuery = {
  default: function _default(query) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        excludeDefaultFilters = _ref.excludeDefaultFilters;

    return DEFAULT_QUERY.merge(fromJS(query)).updateIn(['sorts'], function (sorts) {
      return sorts.push(DEFAULT_SORT);
    }).updateIn(['filterGroups'], function (filterGroups) {
      if (filterGroups.size === 0) {
        filterGroups = filterGroups.push(fromJS({
          filters: []
        }));
      } // allow the client to opt out of the default engagement set
      // the backend runs an AND on the supplied filters, so mismatched sets
      // will result in "missing" engagements - CRM-12391


      if (excludeDefaultFilters) {
        return filterGroups;
      }

      return filterGroups.map(function (filters) {
        var newFilters = filters.get('filters').push(DEFAULT_FILTER);
        return filters.set('filters', newFilters);
      });
    });
  }
};
export default EngagementsSearchAPIQuery;