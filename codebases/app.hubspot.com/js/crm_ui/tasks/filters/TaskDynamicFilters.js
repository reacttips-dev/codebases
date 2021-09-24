'use es6';

import I18n from 'I18n';
import { fromJS } from 'immutable';
import once from 'transmute/once';
var DEFAULT_TASK_STATUS_VALUES = ['NOT_STARTED', 'IN_PROGRESS', 'WAITING', 'DEFERRED'];
var defaultFilters = [{
  operator: 'EQ',
  property: 'engagement.type',
  value: 'TASK'
}, {
  operator: 'IN',
  property: 'task.status',
  values: DEFAULT_TASK_STATUS_VALUES
}];
export default fromJS({
  due_today: once(function () {
    var highValue = I18n.moment.userTz().endOf('day').valueOf();
    var value = I18n.moment.userTz().startOf('day').valueOf();
    return fromJS([].concat(defaultFilters, [{
      property: 'engagement.timestamp',
      dateTimeFormat: 'EPOCH_MILLISECONDS',
      operator: 'BETWEEN',
      highValue: highValue,
      value: value,
      inclusive: true
    }]));
  }),
  due_this_week: once(function () {
    var highValue = I18n.moment.userTz().endOf('week').valueOf();
    var value = I18n.moment.userTz().startOf('week').valueOf();
    return fromJS([].concat(defaultFilters, [{
      property: 'engagement.timestamp',
      dateTimeFormat: 'EPOCH_MILLISECONDS',
      operator: 'BETWEEN',
      highValue: highValue,
      value: value,
      inclusive: true
    }]));
  }),
  overdue: once(function () {
    var value = I18n.moment.userTz().valueOf();
    return fromJS([].concat(defaultFilters, [{
      property: 'engagement.timestamp',
      dateTimeFormat: 'EPOCH_MILLISECONDS',
      operator: 'LTE',
      value: value
    }]));
  })
});