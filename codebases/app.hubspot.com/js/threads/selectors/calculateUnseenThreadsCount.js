'use es6';

import { createSelector } from 'reselect';
import { getUnseenCount } from '../operators/threadGetters';
import { getSelectedThread } from '../../selected-thread/selectors/getSelectedThread';
import { calculateUnseenThreadsCountExcludeCurrent } from './calculateUnseenThreadsCountExcludeCurrent';
export var calculateUnseenThreadsCount = createSelector([getSelectedThread, calculateUnseenThreadsCountExcludeCurrent], function (selectedThread, unseenCount) {
  if (!selectedThread) {
    return unseenCount;
  }

  return unseenCount + (getUnseenCount(selectedThread) ? 1 : 0);
});