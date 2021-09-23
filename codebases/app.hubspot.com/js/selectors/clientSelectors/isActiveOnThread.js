'use es6';

import { getSelectedThreadId } from '../../selected-thread/selectors/getSelectedThreadId';
import { getIsInForeground } from './getIsInForeground';
export function isActiveOnThread(state, threadId) {
  var selectedThreadId = getSelectedThreadId(state);
  return threadId === selectedThreadId && getIsInForeground(state);
}