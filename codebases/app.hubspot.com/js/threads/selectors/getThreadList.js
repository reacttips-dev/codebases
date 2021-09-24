'use es6';

import { createSelector } from 'reselect';
import { getThreads } from './getThreads';
import { isPersistedThread } from '../../threads/operators/isPersistedThread';
export var getThreadList = createSelector([getThreads], function (threads) {
  if (!threads) {
    return undefined;
  }

  return threads.toList().filter(function (thread) {
    return isPersistedThread(thread);
  }).sortBy(function (thread) {
    return -thread.latestMessageTimestamp;
  });
});