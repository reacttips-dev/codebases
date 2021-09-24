'use es6';

import get from 'transmute/get';
import { createSelector } from 'reselect';
import { getThreads } from './getThreads';

var threadIdFromProps = function threadIdFromProps(state, _ref) {
  var threadId = _ref.threadId;
  return threadId;
};

export var getThreadByThreadId = createSelector([getThreads, threadIdFromProps], function (threadsData, threadId) {
  return get(threadId, threadsData);
});