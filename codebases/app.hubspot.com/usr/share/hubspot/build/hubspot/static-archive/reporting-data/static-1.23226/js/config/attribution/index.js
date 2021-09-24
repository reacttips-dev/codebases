'use es6';

import * as checked from '../../lib/checked';
export var Attribution = checked.record({
  model: checked.any(),
  reportId: checked.any()
}, 'Attribution');