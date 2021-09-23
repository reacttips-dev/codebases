'use es6';

import get from 'transmute/get';
import { createSelector } from 'reselect';
import { getData } from 'conversations-async-data/async-data/operators/getters';
import { isStarted } from 'conversations-async-data/async-data/operators/statusComparators';
import { getMessages } from 'conversations-message-history/thread-history/operators/getters';
import { serialize } from 'conversations-message-history/common-message/serializers/messageSerializer';
import { isTypingMessage } from 'conversations-message-history/typing-indicator/operators/isTypingMessage';
export var getAsyncStagedThread = get('stagedThread');
export var isCreatingThread = createSelector(getAsyncStagedThread, isStarted);
export var getStagedThreadHistory = createSelector(getAsyncStagedThread, getData);
export var getVisitorInitialThreadHistory = createSelector(getStagedThreadHistory, function (history) {
  return getMessages(history).toList().filterNot(isTypingMessage).map(serialize).toJS();
});