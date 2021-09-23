'use es6';

import { createSelector } from 'reselect';
import { getData } from 'conversations-async-data/async-data/operators/getters';
import { getThreadsAsyncData } from './getThreadsAsyncData';
export var getThreads = createSelector([getThreadsAsyncData], function (threads) {
  return getData(threads);
});