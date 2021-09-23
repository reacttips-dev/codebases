'use es6';

import { getEntry } from 'conversations-async-data/indexed-async-data/operators/getters';
import { createSelector } from 'reselect';
import { getThreadHistories } from '../../thread-histories/selectors/getThreadHistories';
import { getCurrentThreadId } from './getCurrentThreadId';
export var getCurrentThreadHistoryEntry = createSelector([getThreadHistories, getCurrentThreadId], function (histories, threadId) {
  if (typeof threadId !== 'number') {
    return null;
  }

  return getEntry(threadId, histories) || null;
});