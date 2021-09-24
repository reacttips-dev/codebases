'use es6';

import * as checked from '../../lib/checked';
export var Sort = checked.record({
  property: checked.any(),
  order: checked.any(),
  type: checked.any(),
  metricType: checked.any()
}, 'Sort').defaultValue({});
export var Sorts = checked.list(Sort, 'Sorts').defaultValue([]);