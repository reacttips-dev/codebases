'use es6';

import curry from 'transmute/curry';
import { messageKeyInvariant } from '../invariants/messageKeyInvariant';
import { pubSubMessageRecordInvariant } from '../invariants/pubSubMessageRecordInvariant';
import { threadHistoryInvariant } from '../invariants/threadHistoryInvariant';
import { deleteMessage } from './deleteMessage';
/**
 * Delete a message from ThreadHistory.
 *
 * @param {string} messageKey
 * @param {MessageRecord} message
 * @param {ThreadHistory} threadHistory
 * @returns {ThreadHistory}
 */

export var removeMessageFromThreadHistory = curry(function (messageKey, message, threadHistory) {
  messageKeyInvariant(messageKey);
  pubSubMessageRecordInvariant(message);
  threadHistoryInvariant(threadHistory);
  return deleteMessage(messageKey, threadHistory);
});