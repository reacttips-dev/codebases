'use es6';

import { createSelector } from 'reselect';
import { getThreadId } from '../operators/threadGetters';
import { getThreadList } from './getThreadList';
import { getSelectedThreadId } from '../../selected-thread/selectors/getSelectedThreadId';
export var calculateUnseenThreadsCountExcludeCurrent = createSelector([getThreadList, getSelectedThreadId], function (threads, selectedThreadId) {
  if (!threads) {
    return 0;
  }

  return threads.reduce(function (unseenCount, thread) {
    if (getThreadId(thread) !== selectedThreadId) {
      return unseenCount + (thread.unseenCount ? 1 : 0);
    }

    return unseenCount;
  }, 0);
});