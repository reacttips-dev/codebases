'use es6';

import curry from 'transmute/curry';
import ifThen from 'transmute/ifThen';
import pipe from 'transmute/pipe';
import { isInitialMessage } from '../../initial-message/operators/isInitialMessage';
import { messageKeyInvariant } from '../invariants/messageKeyInvariant';
import { pubSubMessageRecordInvariant } from '../invariants/pubSubMessageRecordInvariant';
import { threadHistoryInvariant } from '../invariants/threadHistoryInvariant';
import { setMessage } from './setMessage';
import { sortMessages } from './sortMessages';
/**
 * Update a message in a ThreadHistory and conditionally sort if the message is not an
 * INITIAL_MESSAGE.
 *
 * Multiple INITIAL_MESSAGEs may be added to the ThreadHistory prior to Publishing.
 * Skipping sort on these messages preserves the order as they are sequentially published.
 *
 * @param {string} messageKey
 * @param {MessageRecord} message
 * @param {ThreadHistory} threadHistory
 * @returns {ThreadHistory}
 */

export var updateMessageInThreadHistory = curry(function (messageKey, message, threadHistory) {
  messageKeyInvariant(messageKey);
  pubSubMessageRecordInvariant(message);
  threadHistoryInvariant(threadHistory);
  return pipe(setMessage(messageKey, message), ifThen(function () {
    return !isInitialMessage(message);
  }, sortMessages))(threadHistory);
});