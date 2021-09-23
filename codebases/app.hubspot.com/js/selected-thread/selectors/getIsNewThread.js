'use es6';

import { createSelector } from 'reselect';
import { getSelectedThreadId } from './getSelectedThreadId';
import { STUBBED_THREAD_ID } from '../../threads/constants/stubbedThreadId';
export var getIsNewThread = createSelector([getSelectedThreadId], function (selectedThreadId) {
  return selectedThreadId === STUBBED_THREAD_ID;
});