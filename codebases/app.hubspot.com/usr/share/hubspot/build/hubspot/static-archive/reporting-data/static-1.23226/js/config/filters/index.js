'use es6';

import * as checked from '../../lib/checked';
export var Filter = checked.record({
  operator: undefined,
  property: undefined,
  value: undefined,
  values: undefined,
  highValue: undefined,
  dateTimeFormat: undefined,
  timeUnit: undefined,
  timeUnitCount: undefined,
  rollForward: undefined,
  inclusive: undefined,
  propertySuffix: undefined
}, 'Filter').fromJS();
export var Filters = checked.record({
  dateRange: checked.any().fromJS(),
  custom: checked.list(Filter).defaultValue([])
}, 'Filters').defaultValue({});