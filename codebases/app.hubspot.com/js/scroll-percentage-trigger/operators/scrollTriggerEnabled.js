'use es6';

import { getMessage } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { getClientTriggers } from 'conversations-internal-schema/message/operators/messageGetters';
import { getDisplayOnScrollPercentage } from 'conversations-internal-schema/client-triggers/operators/clientTriggersGetters';
import { getEnabled } from 'conversations-internal-schema/client-triggers/operators/scrollPercentageTriggerGetters';
export var scrollTriggerEnabled = function scrollTriggerEnabled(widgetData) {
  var message = getMessage(widgetData);
  var clientTriggers = getClientTriggers(message);
  var displayOnScrollPercentage = getDisplayOnScrollPercentage(clientTriggers);
  var enabled = getEnabled(displayOnScrollPercentage);
  return enabled;
};