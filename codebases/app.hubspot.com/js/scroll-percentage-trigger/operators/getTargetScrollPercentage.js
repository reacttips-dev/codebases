'use es6';

import pipe from 'transmute/pipe';
import { getMessage } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { getClientTriggers } from 'conversations-internal-schema/message/operators/messageGetters';
import { getDisplayOnScrollPercentage } from 'conversations-internal-schema/client-triggers/operators/clientTriggersGetters';
import { getScrollPercentage } from 'conversations-internal-schema/client-triggers/operators/scrollPercentageTriggerGetters';
export var getTargetScrollPercentage = function getTargetScrollPercentage(widgetData) {
  return pipe(getMessage, getClientTriggers, getDisplayOnScrollPercentage, getScrollPercentage)(widgetData);
};