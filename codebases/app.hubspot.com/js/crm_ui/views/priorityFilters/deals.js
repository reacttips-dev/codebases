'use es6';

import { DEFAULT } from 'customer-data-objects/view/ViewTypes';
import * as ViewIdMapping from '../ViewIdMapping';
import { fromJS } from 'immutable';
var priorityViewIds = {
  event_this_week: ViewIdMapping.get('event_this_week'),
  event_today: ViewIdMapping.get('event_today'),
  event_none: ViewIdMapping.get('event_none')
};
var defaults = {
  type: DEFAULT,
  columns: [{
    name: 'dealname'
  }, {
    name: 'dealstage'
  }, {
    name: 'closedate'
  }, {
    name: 'hubspot_owner_id'
  }, {
    name: 'amount'
  }, {
    name: 'relatesTo',
    label: 'Relates to'
  }],
  state: {
    sortKey: 'closedate',
    order: 1
  },
  filters: []
};
var viewConfigs = [{
  id: 'event_today',
  translationKey: 'filterSidebar.defaultViews.eventToday',
  filters: [{
    operator: 'ROLLING_DATE_RANGE',
    property: 'notes_next_activity_date',
    inclusive: true,
    rollForward: false,
    timeUnit: 'DAY',
    timeUnitCount: 1,
    value: 'DAY;1;true;false'
  }]
}, {
  id: 'event_this_week',
  translationKey: 'filterSidebar.defaultViews.eventThisWeek',
  filters: [{
    operator: 'ROLLING_DATE_RANGE',
    property: 'notes_next_activity_date',
    inclusive: true,
    rollForward: false,
    timeUnit: 'WEEK',
    timeUnitCount: 1,
    value: 'WEEK;1;true;false'
  }]
}, {
  id: 'event_none',
  translationKey: 'filterSidebar.defaultViews.staleDeals',
  filters: [{
    operator: 'NOT_HAS_PROPERTY',
    property: 'notes_next_activity_date',
    dateTimeFormat: 'DATE'
  }, {
    operator: 'HAS_PROPERTY',
    property: 'notes_last_updated',
    dateTimeFormat: 'DATE'
  }]
}];
export var getDefaults = function getDefaults(__objectType) {
  return fromJS(viewConfigs.map(function (viewConfig) {
    return Object.assign({}, defaults, {}, viewConfig);
  }));
};
export var getFavorites = function getFavorites(__objectType) {
  return fromJS([priorityViewIds.event_today, priorityViewIds.event_this_week, priorityViewIds.event_none]);
};
export var isPriorityFilter = function isPriorityFilter(__objectType) {
  var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return !!priorityViewIds[view.id];
};