'use es6';

import { getMessage } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { getClientTriggers } from 'conversations-internal-schema/message/operators/messageGetters';
import { getDisplayOnExitIntent } from 'conversations-internal-schema/client-triggers/operators/clientTriggersGetters';
import { getEnabled } from 'conversations-internal-schema/client-triggers/operators/exitIntentTriggerGetters';
export var exitIntentTriggerEnabled = function exitIntentTriggerEnabled(widgetData) {
  var message = getMessage(widgetData);
  var clientTriggers = getClientTriggers(message);
  var displayOnExitIntent = getDisplayOnExitIntent(clientTriggers);
  var enabled = getEnabled(displayOnExitIntent);
  return enabled;
};