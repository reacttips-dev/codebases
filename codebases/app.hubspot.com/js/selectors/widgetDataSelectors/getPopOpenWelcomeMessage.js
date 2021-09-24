'use es6';

import { createSelector } from 'reselect';
import { getWelcomeMessage } from './getWelcomeMessage';
export var getPopOpenWelcomeMessage = createSelector(getWelcomeMessage, function () {
  var welcomeMessage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return !!welcomeMessage.popOpenWelcomeMessage;
});