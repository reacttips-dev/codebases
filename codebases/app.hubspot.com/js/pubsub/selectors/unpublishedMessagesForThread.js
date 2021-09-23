'use es6';

import { getData } from 'conversations-async-data/async-data/operators/getters';
import { getEntries } from 'conversations-async-data/indexed-async-data/operators/getters';
import { getThreadId } from '../../threads/operators/threadGetters';
import { createSelector } from 'reselect';
import { threadFromProps } from '../../threads/selectors/threadFromProps';
import { getSortedMessagesByThreadId } from '../operators/getSortedMessagesByThreadId';
import { getUnpublishedMessages } from './getUnpublishedMessages';
export var unpublishedMessagesForThread = createSelector([getUnpublishedMessages, threadFromProps], function (unpublishedMessages, thread) {
  var threadId = getThreadId(thread);
  var messages = getEntries(unpublishedMessages).map(getData);
  return getSortedMessagesByThreadId(messages, threadId);
});