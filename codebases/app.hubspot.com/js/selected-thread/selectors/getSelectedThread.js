'use es6';

import { createSelector } from 'reselect';
import { getThreads } from '../../threads/selectors/getThreads';
import { getSelectedThreadId } from './getSelectedThreadId';
import { STUBBED_THREAD_ID } from '../../threads/constants/stubbedThreadId';
import { getStubbedThread } from './getStubbedThread';
export var getSelectedThread = createSelector([getThreads, getSelectedThreadId, getStubbedThread], function (threads, selectedThreadId, stubbedThread) {
  if (selectedThreadId === STUBBED_THREAD_ID) {
    return stubbedThread;
  }

  if (!threads) {
    return null;
  }

  return threads.get(selectedThreadId) || null;
});