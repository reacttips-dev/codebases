'use es6';

import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { THREAD_INBOX_UPDATED } from '../constants/messageTypes';
export var isInboxUpdateMessage = function isInboxUpdateMessage(message) {
  return getTopLevelType(message) === THREAD_INBOX_UPDATED;
};