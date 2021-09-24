'use es6';

import { getMessage } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { getPopOpenWidget } from 'conversations-internal-schema/message/operators/messageGetters';
import { getData } from 'conversations-async-data/async-data/operators/getters';
import { hasClientTriggers } from '../../client-triggers/operators/hasClientTriggers';
export var hasPopOpenWidgetAndClientTriggers = function hasPopOpenWidgetAndClientTriggers(widgetAsyncData) {
  var widgetData = getData(widgetAsyncData);
  var messageData = getMessage(widgetData);
  var popOpenWidget = getPopOpenWidget(messageData);
  var clientTriggers = hasClientTriggers(widgetData);
  return popOpenWidget && clientTriggers;
};