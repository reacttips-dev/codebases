'use es6';

import both from 'transmute/both';
import { isInitialMessage } from 'conversations-message-history/initial-message/operators/isInitialMessage';
import { isFromAgent } from 'conversations-message-history/common-message-format/operators/senderTypeComparators';
import { getMessageIsApproximatelyFromCurrentSession } from 'conversations-message-history/thread-history/operators/getMessageIsApproximatelyFromCurrentSession';
import { hasMessages } from 'conversations-message-history/thread-history/operators/hasMessages';
import { getMessages } from 'conversations-message-history/thread-history/operators/getMessages';
export var hasAgentReplyFromCurrentSession = function hasAgentReplyFromCurrentSession(threadHistory) {
  if (!hasMessages(threadHistory)) {
    return false;
  }

  var messages = getMessages(threadHistory);
  var mostRecentAgentReply = messages.findLast(both(function (message) {
    return !isInitialMessage(message);
  }, isFromAgent));
  return !!(mostRecentAgentReply && getMessageIsApproximatelyFromCurrentSession(mostRecentAgentReply));
};