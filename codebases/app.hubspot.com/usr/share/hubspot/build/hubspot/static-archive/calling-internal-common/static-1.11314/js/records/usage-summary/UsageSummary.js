'use es6';

import { Record } from 'immutable';
var UsageSummary = Record({
  userMinutesAvailable: 0,
  trialAccount: false,
  userMinutesUsed: 0,
  userSecondsUsed: 0
}, 'UsageSummary');
export default UsageSummary;