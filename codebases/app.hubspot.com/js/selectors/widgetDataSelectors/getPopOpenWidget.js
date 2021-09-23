'use es6';

import { createSelector } from 'reselect';
import { getPopOpenWidget as getPopOpenWidgetOperator } from 'conversations-internal-schema/message/operators/messageGetters';
import { getWelcomeMessage } from './getWelcomeMessage';
export var getPopOpenWidget = createSelector(getWelcomeMessage, function () {
  var welcomeMessage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return getPopOpenWidgetOperator(welcomeMessage);
});