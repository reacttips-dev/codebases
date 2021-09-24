'use es6';

import pipe from 'transmute/pipe';
import { getMessage } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { getClientTriggers } from 'conversations-internal-schema/message/operators/messageGetters';
import { getDisplayOnTimeDelay } from 'conversations-internal-schema/client-triggers/operators/clientTriggersGetters';
import { getTimeDelaySeconds } from 'conversations-internal-schema/client-triggers/operators/timeDelayTriggerGetters';
export var timeOnPageTriggerDelaySeconds = function timeOnPageTriggerDelaySeconds(widgetData) {
  return pipe(getMessage, getClientTriggers, getDisplayOnTimeDelay, getTimeDelaySeconds)(widgetData);
};