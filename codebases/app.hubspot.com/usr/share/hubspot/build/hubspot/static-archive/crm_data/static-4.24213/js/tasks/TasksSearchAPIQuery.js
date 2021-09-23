'use es6';

import { fromJS, Map as ImmutableMap, List } from 'immutable';
var DEFAULT_QUERY = ImmutableMap({
  offset: 0,
  count: 10,
  filterGroups: List(),
  sorts: List()
});
var DEFAULT_FILTER = ImmutableMap({
  operator: 'EQ',
  property: 'engagement.type',
  value: 'TASK'
});
var DEFAULT_SORT = ImmutableMap({
  property: 'engagement.id',
  order: 'DESC'
});
var TasksSearchAPIQuery = {
  default: function _default(query) {
    return DEFAULT_QUERY.merge(fromJS(query)).updateIn(['sorts'], function (sorts) {
      return sorts.push(DEFAULT_SORT);
    }).updateIn(['filterGroups'], function (filterGroups) {
      if (filterGroups.size === 0) {
        filterGroups = filterGroups.push(ImmutableMap({
          filters: List()
        }));
      }

      return filterGroups.map(function (group) {
        var updatedFilters = group.get('filters').push(DEFAULT_FILTER);
        return group.set('filters', updatedFilters);
      });
    });
  }
};
export default TasksSearchAPIQuery;