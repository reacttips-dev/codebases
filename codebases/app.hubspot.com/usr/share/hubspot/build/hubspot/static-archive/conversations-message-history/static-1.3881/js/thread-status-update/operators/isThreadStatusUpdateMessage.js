'use es6';

import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { THREAD_STATUS_UPDATE } from '../constants/messageTypes';
export var isThreadStatusUpdateMessage = function isThreadStatusUpdateMessage(message) {
  return getTopLevelType(message) === THREAD_STATUS_UPDATE;
};