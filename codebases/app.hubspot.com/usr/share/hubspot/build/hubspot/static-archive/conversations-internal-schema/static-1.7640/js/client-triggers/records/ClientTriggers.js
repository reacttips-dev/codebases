'use es6';

import { Record } from 'immutable';
import ScrollPercentageTrigger from './ScrollPercentageTrigger';
import TimeDelayTrigger from './TimeDelayTrigger';
import ExitIntentTrigger from './ExitIntentTrigger';
var ClientTriggers = new Record({
  displayOnScrollPercentage: new ScrollPercentageTrigger(),
  displayOnTimeDelay: new TimeDelayTrigger(),
  displayOnExitIntent: new ExitIntentTrigger()
}, 'ClientTriggers');
export default ClientTriggers;