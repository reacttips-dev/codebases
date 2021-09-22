import * as ThreadsApi from 'bundles/discussions/api/threadsApi';
import getCurrentSocialProfile from 'pages/open-course/common/models/currentSocialProfile';
import { loadingStates } from 'bundles/discussions/constants';

export const clearThreadsCache = (actionContext) => actionContext.dispatch('CLEAR_THREADS_CACHE');

export const loadThreads = (
  actionContext,
  { filterQueryString, sort, answered, pageNum, backgroundLoad = false, forumType, forumId, userId, includeDeleted }
) => {
  if (!backgroundLoad) {
    actionContext.dispatch('START_THREADS_LOAD', {
      filterQueryString,
      sort,
      answered,
      pageNum,
      forumType,
      forumId,
      userId,
    });
  }
  const ThreadsStore = actionContext.getStore('ThreadsStore');
  const hasAlreadyLoadedPage = ThreadsStore.hasLoadedThreadPage({
    filterQueryString,
    sort,
    answered,
    pageNum,
    currentForumId: forumId,
  });

  if (!hasAlreadyLoadedPage) {
    if (!backgroundLoad) {
      actionContext.dispatch('UPDATE_THREADS_LOADING_STATE', loadingStates.LOADING);
    }
    ThreadsApi.load({
      sort,
      answered,
      pageNum,
      filterQueryString,
      forumType,
      forumId,
      userId,
      includeDeleted,
    })
      .then((results) =>
        actionContext.dispatch('RECEIVE_THREADS', {
          results,
          filterQueryString,
          sort,
          answered,
          pageNum,
          currentForumId: forumId,
        })
      )
      .fail((error) => actionContext.dispatch('THREADS_API_ERROR', error))
      .done();
  }
};

export const addThread = (actionContext, { options, forumType, forumId }) => {
  actionContext.dispatch('THREADS_API_SAVING');
  ThreadsApi.add(options, forumType)
    .then((results) => {
      const splitId = results.elements[0].id.split('~');
      actionContext.dispatch(
        'RECEIVE_NEW_THREAD',
        // we prefer a non-backbone model, so grab the attributes instead of the profile itself
        Object.assign(results.elements[0], {
          creator: getCurrentSocialProfile().attributes,
          forumId,
          questionId: splitId[2],
        })
      );
    })
    .fail((error) => actionContext.dispatch('THREADS_API_SAVE_ERROR', error))
    .done();
};
