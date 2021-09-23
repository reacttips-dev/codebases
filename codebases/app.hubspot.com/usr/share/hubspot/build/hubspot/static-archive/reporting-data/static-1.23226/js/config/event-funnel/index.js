'use es6';

import * as checked from '../../lib/checked';
export var EventFunnel = checked.record({
  reportIds: checked.list(checked.string())
}, 'EventFunnel');