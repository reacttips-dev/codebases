import * as ThreadDetailsUtils from 'bundles/discussions/api/threadDetailsUtils';
import { clearThreadsCache } from 'bundles/discussions/actions/ThreadsActions';

/**
 * Utility function for dispatching errors to store - not exported.
 */
const errorAction = function (actionContext, error) {
  actionContext.dispatch('THREAD_SETTINGS_ERROR', error);
};

export const addThread = function (actionContext, threadInfo) {
  actionContext.dispatch('ADD_THREAD', threadInfo);
};

export const closeThread = function (actionContext, { questionId, forumType }) {
  ThreadDetailsUtils.closeThread(questionId, forumType)
    .then(
      () => {
        actionContext.dispatch('CLOSE_THREAD', questionId);
      },
      (error) => {
        actionContext.executeAction(errorAction, error);
      }
    )
    .done();
};

export const uncloseThread = function (actionContext, { questionId, forumType }) {
  ThreadDetailsUtils.uncloseThread(questionId, forumType)
    .then(
      () => {
        actionContext.dispatch('UNCLOSE_THREAD', questionId);
      },
      (error) => {
        actionContext.executeAction(errorAction, error);
      }
    )
    .done();
};

export const pinThread = function (actionContext, { questionId, forumType }) {
  ThreadDetailsUtils.pinThread(questionId, forumType)
    .then(
      () => {
        // make sure cache is cleared so that the new pin will show up in threads view
        clearThreadsCache(actionContext);
        actionContext.dispatch('PIN_THREAD', questionId);
      },
      (error) => {
        actionContext.executeAction(errorAction, error);
      }
    )
    .done();
};

export const unpinThread = function (actionContext, { questionId, forumType }) {
  ThreadDetailsUtils.unpinThread(questionId, forumType)
    .then(
      () => {
        // make sure cache is cleared so that the pin will no longer show in threads view
        clearThreadsCache(actionContext);
        actionContext.dispatch('UNPIN_THREAD', questionId);
      },
      (error) => {
        actionContext.executeAction(errorAction, error);
      }
    )
    .done();
};
