'use es6';

import { getCurrentStatus, getPreviousStatus } from './threadStatusUpdateMessageGetters';
import ChatFilterOptions from 'conversations-internal-schema/constants/ChatFilterOptions';
export var hasThreadBeenClosed = function hasThreadBeenClosed(message) {
  var prevStatus = getPreviousStatus(message);
  var currentStatus = getCurrentStatus(message);
  return prevStatus === ChatFilterOptions.STARTED && currentStatus === ChatFilterOptions.ENDED;
};