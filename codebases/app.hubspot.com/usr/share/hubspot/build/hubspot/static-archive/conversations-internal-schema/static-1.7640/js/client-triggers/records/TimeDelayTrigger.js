'use es6';

import { Record } from 'immutable';
var TimeDelayTrigger = new Record({
  enabled: false,
  timeDelaySeconds: 0
}, 'TimeDelayTrigger');
export default TimeDelayTrigger;