'use es6';

import I18n from 'I18n';
import { createSelector } from 'reselect';
import { getWelcomeMessage } from './getWelcomeMessage';
export var getAskForEmailMessage = createSelector(getWelcomeMessage, function () {
  var welcomeMessage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return welcomeMessage.askForEmailMessage || I18n.text('conversations-visitor-ui.askForEmailMessage');
});