'use es6';

import { getAnyCustomChatName } from 'conversations-internal-schema/chat-heading-config/operators/getAnyCustomChatName';
import { getRespondersNameText } from './getRespondersNameText';
export var getWidgetTitleText = function getWidgetTitleText(chatHeadingConfig, responders, locale) {
  var responderNames = getRespondersNameText(responders, locale);
  return responderNames || getAnyCustomChatName(chatHeadingConfig);
};