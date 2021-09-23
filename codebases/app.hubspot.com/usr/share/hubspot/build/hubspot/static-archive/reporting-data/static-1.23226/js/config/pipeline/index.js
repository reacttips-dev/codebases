'use es6';

import * as checked from '../../lib/checked';
export var Pipeline = checked.record({
  id: checked.any(),
  stages: checked.list(checked.string()).defaultValue([])
}, 'Pipeline');