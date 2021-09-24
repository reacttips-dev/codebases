'use es6';

import { createSelector } from 'reselect';
import { getShowPreviousConversations as getShowPreviousConversationsOperator } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
export var getShowPreviousConversations = createSelector([getLatestWidgetData], function (widgetData) {
  return getShowPreviousConversationsOperator(widgetData);
});