'use es6';

import { createSelector } from 'reselect';
import { getThreadList } from './getThreadList';
import { getCurrentView } from '../../current-view/selectors/getCurrentView';
import { THREAD_LIST, KNOWLEDGE_BASE } from '../../current-view/constants/views';
import { getShowPreviousConversations } from '../../widget-data/selectors/getShowPreviousConversations';
import { getKnowledgeBaseEnabled } from '../../selectors/widgetDataSelectors/getKnowledgeBaseEnabled';
var getIsThreadListView = createSelector([getCurrentView], function (currentView) {
  return currentView === THREAD_LIST;
});
var getIsKnowledgeBaseView = createSelector([getCurrentView], function (currentView) {
  return currentView === KNOWLEDGE_BASE;
});
export var getShowBackButton = createSelector([getThreadList, getIsThreadListView, getShowPreviousConversations, getIsKnowledgeBaseView, getKnowledgeBaseEnabled], function (threads, isThreadListRoute, showPreviousConversations, isKnowledgeBaseView, knowledgeBaseEnabled) {
  if (isThreadListRoute || isKnowledgeBaseView) {
    return false;
  }

  if (knowledgeBaseEnabled) {
    return true;
  }

  if (!showPreviousConversations || !threads) {
    return false;
  }

  var numThreads = threads.size;
  var hasThreadsForThreadList = numThreads > 0;
  return hasThreadsForThreadList;
});