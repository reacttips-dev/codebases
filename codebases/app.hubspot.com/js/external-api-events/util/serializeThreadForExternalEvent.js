'use es6';

import { getThreadId } from '../../threads/operators/threadGetters';
export var serializeThreadForExternalEvent = function serializeThreadForExternalEvent(thread) {
  return {
    conversationId: getThreadId(thread)
  };
};