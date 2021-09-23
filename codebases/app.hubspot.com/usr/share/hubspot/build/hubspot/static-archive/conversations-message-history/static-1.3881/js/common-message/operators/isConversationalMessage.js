'use es6';

import { getType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { CONVERSATIONAL_MESSAGE_TYPES } from '../constants/messageTypeGroups';
export function isConversationalMessage(message) {
  var type = getType(message);
  return CONVERSATIONAL_MESSAGE_TYPES.includes(type);
}