'use es6';

import { getMessage } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { getClientTriggers } from 'conversations-internal-schema/message/operators/messageGetters';
import { getDisplayOnTimeDelay } from 'conversations-internal-schema/client-triggers/operators/clientTriggersGetters';
import { getEnabled } from 'conversations-internal-schema/client-triggers/operators/scrollPercentageTriggerGetters';
export var timeOnPageTriggerEnabled = function timeOnPageTriggerEnabled(widgetData) {
  var message = getMessage(widgetData);
  var clientTriggers = getClientTriggers(message);
  var displayOnTimeDelay = getDisplayOnTimeDelay(clientTriggers);
  var enabled = getEnabled(displayOnTimeDelay);
  return enabled;
};