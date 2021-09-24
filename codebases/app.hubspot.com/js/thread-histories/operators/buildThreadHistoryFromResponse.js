'use es6';

import ThreadHistory from 'conversations-message-history/thread-history/records/ThreadHistory';
export var buildThreadHistoryFromResponse = function buildThreadHistoryFromResponse(threadHistory) {
  return new ThreadHistory(threadHistory);
};