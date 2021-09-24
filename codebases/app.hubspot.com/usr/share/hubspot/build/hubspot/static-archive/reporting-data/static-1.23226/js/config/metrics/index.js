'use es6';

import * as checked from '../../lib/checked';
export var Metric = checked.record({
  property: checked.string(),
  metricTypes: checked.list(checked.string()).defaultValue([])
});
export var Metrics = checked.list(Metric, 'Metrics').defaultValue([]);