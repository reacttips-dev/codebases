'use es6';

import pipe from 'transmute/pipe';
import { getThreadId } from './threadGetters';
import { STUBBED_THREAD_ID } from '../../threads/constants/stubbedThreadId';
export var isPersistedThread = pipe(getThreadId, function (threadId) {
  return threadId !== STUBBED_THREAD_ID;
});