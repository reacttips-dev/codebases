'use es6';

import { isThreadStatusUpdateMessage } from './isThreadStatusUpdateMessage';
import { getCurrentStatus } from '../../thread-status-update/operators/threadStatusUpdateMessageGetters';
import ChatFilterOptions from 'conversations-internal-schema/constants/ChatFilterOptions';
export var isOpenThreadMessage = function isOpenThreadMessage(message) {
  return isThreadStatusUpdateMessage(message) && getCurrentStatus(message) === ChatFilterOptions.STARTED;
};