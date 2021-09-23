'use es6';

import get from 'transmute/get';
import ClientTriggers from '../records/ClientTriggers';
import ExitIntentTrigger from '../records/ExitIntentTrigger';
import ScrollPercentageTrigger from '../records/ScrollPercentageTrigger';
import TimeDelayTrigger from '../records/TimeDelayTrigger';
export var buildClientTriggers = function buildClientTriggers() {
  var clientTriggersData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return new ClientTriggers({
    displayOnScrollPercentage: new ScrollPercentageTrigger(get('displayOnScrollPercentage', clientTriggersData)),
    displayOnTimeDelay: new TimeDelayTrigger(get('displayOnTimeDelay', clientTriggersData)),
    displayOnExitIntent: new ExitIntentTrigger(get('displayOnExitIntent', clientTriggersData))
  });
};