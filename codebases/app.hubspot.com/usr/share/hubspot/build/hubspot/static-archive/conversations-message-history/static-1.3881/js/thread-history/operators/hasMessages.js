'use es6';

import pipe from 'transmute/pipe';
import { threadHistoryInvariant } from '../invariants/threadHistoryInvariant';
import { getMessages } from './getters';
export var hasMessages = function hasMessages(threadHistory) {
  threadHistoryInvariant(threadHistory);
  return pipe(getMessages, function (messages) {
    return !!(messages && messages.size > 0);
  })(threadHistory);
};