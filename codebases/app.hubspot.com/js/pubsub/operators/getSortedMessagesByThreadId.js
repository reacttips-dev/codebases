'use es6';

import { getThreadId } from '../../threads/operators/threadGetters';
import { getTimestamp } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import { getMessage } from 'conversations-message-history/unpublished-messages/operators/getters';
export var getSortedMessagesByThreadId = function getSortedMessagesByThreadId(unpublishedMessages, threadId) {
  return unpublishedMessages.filter(function (message) {
    return getThreadId(message) === threadId;
  }).sort(function (unpublishedMessageA, unpublishedMessageB) {
    var messageA = getMessage(unpublishedMessageA);
    var messageB = getMessage(unpublishedMessageB);
    return getTimestamp(messageA) - getTimestamp(messageB);
  });
};