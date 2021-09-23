'use es6';

import curry from 'transmute/curry';
import pipe from 'transmute/pipe';
import { messageKeyInvariant } from 'conversations-message-history/thread-history/invariants/messageKeyInvariant';
import { threadHistoryInvariant } from 'conversations-message-history/thread-history/invariants/threadHistoryInvariant';
import { setMessage } from 'conversations-message-history/thread-history/operators/setMessage';
import { sortMessages } from 'conversations-message-history/thread-history/operators/sortMessages';
import { historyMessageInvariant } from '../invariants/historyMessageInvariant';
/**
 * Add a message to ThreadHistory and conditionally sort if the message is not
 * presentational.  Sorting can be skipped otherwise because the projection of
 * the history will not change.
 *
 * @param {string} messageKey
 * @param {MessageRecord} message
 * @param {ThreadHistory} threadHistory
 * @returns {ThreadHistory}
 */

export var addMessageToThreadHistory = curry(function (messageKey, message, threadHistory) {
  messageKeyInvariant(messageKey);
  historyMessageInvariant(message);
  threadHistoryInvariant(threadHistory);
  return pipe(setMessage(messageKey, message), sortMessages)(threadHistory);
});