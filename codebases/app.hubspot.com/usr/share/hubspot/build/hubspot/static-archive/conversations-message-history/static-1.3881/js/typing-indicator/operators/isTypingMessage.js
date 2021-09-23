'use es6';

import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { TYPING } from '../constants/messageTypes';
export var isTypingMessage = function isTypingMessage(message) {
  return getTopLevelType(message) === TYPING;
};