'use es6';

import { createSelector } from 'reselect';
import { getThreads } from './getThreads';
export var hasPersistedThreads = createSelector(getThreads, function (threads) {
  return !!threads.size;
});