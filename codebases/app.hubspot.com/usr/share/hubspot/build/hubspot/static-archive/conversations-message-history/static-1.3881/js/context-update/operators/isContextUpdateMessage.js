'use es6';

import { CONTEXT_UPDATE } from '../constants/messageTypes';
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
export var isContextUpdateMessage = function isContextUpdateMessage(message) {
  return getTopLevelType(message) === CONTEXT_UPDATE;
};