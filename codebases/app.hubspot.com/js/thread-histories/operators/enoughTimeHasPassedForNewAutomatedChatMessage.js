'use es6';

import pipe from 'transmute/pipe';
import { getTimestamp } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import { lastMessage } from 'conversations-message-history/thread-history/operators/lastMessage';
import { SESSION_EXPIRY_TIME_APPROXIMATION_IN_MS } from 'conversations-message-history/thread-history/constants/ThreadHistoryConstants';
export var enoughTimeHasPassedForNewAutomatedChatMessage = function enoughTimeHasPassedForNewAutomatedChatMessage(threadHistory) {
  if (!threadHistory) {
    return false;
  }

  var latestMessageTimestamp = pipe(lastMessage, getTimestamp)(threadHistory);
  return Date.now() - latestMessageTimestamp >= SESSION_EXPIRY_TIME_APPROXIMATION_IN_MS;
};