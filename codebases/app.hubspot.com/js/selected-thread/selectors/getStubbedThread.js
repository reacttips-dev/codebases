'use es6';

import { createSelector } from 'reselect';
import { getMessagesPageUri } from '../../selectors/widgetDataSelectors/getMessagesPageUri';
import { buildThread } from '../../threads/factories/buildThread';
import { getInitialMessageText } from '../../selectors/widgetDataSelectors/getInitialMessageText';
import { setLatestMessage } from '../../threads/operators/setLatestMessage';
import { LIVE_CHAT } from 'conversations-internal-schema/constants/ThreadSources';
import { STUBBED_THREAD_ID } from '../../threads/constants/stubbedThreadId';
import { buildCommonMessage } from 'conversations-message-history/common-message-format/operators/buildCommonMessage';
export var getStubbedThread = createSelector([getMessagesPageUri, getInitialMessageText], function (messagesPageUri, initialMessageText) {
  var latestMessage = buildCommonMessage({
    text: initialMessageText
  });
  var thread = buildThread({
    source: LIVE_CHAT,
    threadId: STUBBED_THREAD_ID,
    currentUrl: messagesPageUri
  });
  return setLatestMessage(latestMessage, thread);
});