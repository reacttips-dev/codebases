'use es6';

import { getType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { AUTOMATED_CHAT_MESSAGE_TYPES } from '../constants/messageTypeGroups';
export function isAutomatedChatMessage(message) {
  var type = getType(message);
  return AUTOMATED_CHAT_MESSAGE_TYPES.includes(type);
}