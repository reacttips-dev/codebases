'use es6';

import { createSelector } from 'reselect';
import { getBotResponder } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
import { isTypeBot } from 'conversations-internal-schema/responders/operators/isTypeBot';
export var getWidgetBotResponder = createSelector([getLatestWidgetData], function (widgetData) {
  return isTypeBot(getBotResponder(widgetData)) ? getBotResponder(widgetData) : null;
});