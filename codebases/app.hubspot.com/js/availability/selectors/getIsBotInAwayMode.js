'use es6';

import { createSelector } from 'reselect';
import { getAssignedResponderInWidget } from '../../responders/selectors/getAssignedResponderInWidget';
import { getIsBot } from 'conversations-internal-schema/responders/operators/responderGetters';
import { getIsWidgetInAwayMode } from './getIsWidgetInAwayMode';
export var getIsBotInAwayMode = createSelector([getIsWidgetInAwayMode, getAssignedResponderInWidget], function (isWidgetInAwayMode, assignedResponder) {
  return Boolean(isWidgetInAwayMode && assignedResponder && getIsBot(assignedResponder));
});