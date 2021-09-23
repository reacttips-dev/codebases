'use es6';

import get from 'transmute/get';
export var getThreadsAsyncData = function getThreadsAsyncData(state) {
  return get('threads', state);
};