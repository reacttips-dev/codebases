'use es6';

import curry from 'transmute/curry';
import pipe from 'transmute/pipe';
import { threadHistoryInvariant } from '../invariants/threadHistoryInvariant';
import { mergeMessages } from './mergeMessages';
import { sortMessages } from './sortMessages';
import { getMessages, getAttachments } from './getters';
import { mergeAttachments } from './mergeAttachments';
/**
 * Add a new page of messages to a Threadhistory
 *
 * @param {ThreadHistory} newThreadHistory
 * @param {ThreadHistory} threadHistory
 * @returns {ThreadHistory}
 */

export var addPageOfMessagesToThreadHistory = curry(function (newThreadHistory, threadHistory) {
  threadHistoryInvariant(newThreadHistory);
  threadHistoryInvariant(threadHistory);
  return pipe(mergeMessages(getMessages(threadHistory)), sortMessages, mergeAttachments(getAttachments(threadHistory)))(newThreadHistory);
});