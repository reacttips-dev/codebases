import { addThread } from 'bundles/discussions/actions/ThreadSettingsActions';
import { upvote as upvoteApi, cancelUpvote as cancelUpvoteApi } from 'bundles/discussions/api/upvoteApi';
import { follow as followApi, unfollow as unfollowApi } from 'bundles/discussions/api/followApi';
import {
  getQuestion,
  getAnswersWithComments,
  getComments,
  savePost as savePostApi,
} from 'bundles/discussions/api/threadDetailApi';
import { savingStates, loadingStates, answers } from 'bundles/discussions/constants';
import unreadTracker from 'bundles/discussions/utils/unreadTracker';

import { getProgress } from 'bundles/ondemand/actions/ProgressActions';
import { loadCourseMaterials } from 'bundles/ondemand/actions/CourseActions';
import { refreshCourseViewGrade } from 'bundles/ondemand/actions/CourseViewGradeActions';

const ANSWER_LIMIT = answers.limitPerPage;

export const fetchThread = function (actionContext, { questionId, contextId, userId, forumType, sort, page }) {
  // Only fetch if it's not already present.
  // If it's already present, add that thread to the thread settings
  const threadDetail =
    actionContext.getStore('ThreadDetailsStore').getQuestion(questionId) &&
    actionContext.getStore('ThreadDetailsStore').getQuestion(questionId);

  const threadsPage = actionContext.getStore('ThreadsStore').getThreadsPage();
  const threadFromThreadsStore = threadsPage.find((q) => q.questionId === questionId);

  if (!threadDetail || unreadTracker.hasUnread(threadFromThreadsStore)) {
    const setLoadingState = function (loadingState) {
      actionContext.dispatch('QUESTION_LOADING_STATE', {
        questionId,
        loadingState,
      });
    };

    setLoadingState(loadingStates.LOADING);
    actionContext.dispatch('UNSET_QUESTION', { questionId });

    getQuestion({ questionId, userId, contextId, forumType, sort, page })
      .then((resp) => {
        actionContext.dispatch('LOAD_QUESTION', {
          response: resp,
          questionId,
          forumType,
        });

        setLoadingState(loadingStates.DONE);
        actionContext.executeAction(addThread, Object.assign(resp.elements[0], { forumType }));
        unreadTracker.markRead(questionId);
      })
      .fail((err) => setLoadingState(loadingStates.ERROR))
      .done();
  } else {
    actionContext.executeAction(addThread, actionContext.getStore('ThreadDetailsStore').getQuestion(questionId));
    unreadTracker.markRead(questionId);
  }
};

/*
 * This is an internal function that does not set the loading state of the comment to be LOADING before loading the
 * comment page, because if this is called multiple times, batching the `dispatch` calls into one call is much more
 * efficient. Any wrapper on this function must set the comment loading state to be LOADING before calling it.
 */
const fetchCommentPagesHelper = function (
  actionContext,
  { userId, questionId, answerId, userForumAnswerId, forumType, includeDeleted, startPage, endPage, commentLimit }
) {
  return getComments({
    userForumAnswerId,
    forumType,
    includeDeleted,
    startPage,
    endPage,
    commentLimit,
  })
    .then((response) =>
      actionContext.dispatch('LOAD_COMMENT_PAGES', {
        response,
        userId,
        userForumAnswerId,
        answerId,
        startPage,
        questionId,
      })
    )
    .fail((error) => {
      actionContext.dispatch('COMMENT_LOADING_STATE', {
        answerId,
        loadingState: loadingStates.ERROR,
      });
    });
};

export const fetchMultipleCommentPages = function (
  actionContext,
  { userId, questionId, answerId, userForumAnswerId, forumType, includeDeleted, startPage, endPage, commentLimit }
) {
  actionContext.dispatch('COMMENT_LOADING_STATE', {
    answerId,
    loadingState: loadingStates.LOADING,
  });

  actionContext.executeAction(fetchCommentPagesHelper, {
    userId,
    questionId,
    answerId,
    userForumAnswerId,
    forumType,
    includeDeleted,
    startPage,
    endPage,
    commentLimit,
  });
};

export const fetchAnswers = function (
  actionContext,
  {
    questionId,
    userId,
    contextId,
    courseId,
    courseSlug,
    sort,
    page,
    limit,
    forumType,
    includeDeleted,
    forumTypeSetting,
  }
) {
  const setLoadingState = function (loadingState) {
    actionContext.dispatch('ANSWER_LOADING_STATE', {
      questionId,
      sort,
      page,
      loadingState,
    });
  };

  setLoadingState(loadingStates.LOADING);

  getAnswersWithComments({
    questionId,
    userId,
    contextId,
    forumType,
    sort,
    page,
    limit: limit || ANSWER_LIMIT,
    includeDeleted,
    forumTypeSetting,
  })
    .then((resp) => {
      actionContext.dispatch('LOAD_ANSWERS_WITH_COMMENTS', {
        userId,
        response: resp,
        questionId,
        page,
        sort,
        forumType,
      });
    })
    .then(() => {
      // update course progress so that when completing discussion items, course home progress indicators update
      // oddly enough, this seems to be the commit point for many discussion operations
      // not clear if course context always exists (e.g. authoring views), so boolean check for condition where it doesn't
      if (courseId && courseSlug) {
        actionContext.executeAction(refreshCourseViewGrade, { courseId });
        actionContext.executeAction(getProgress, { courseId, refreshProgress: true });
        actionContext.executeAction(loadCourseMaterials, { courseSlug, refetch: true });
      }
    })
    .fail((err) => setLoadingState(loadingStates.ERROR))
    .done();
};

/**
 * Isolated the logic for how to determine the storage ID to simplfy testing.
 */
export const getFluxiblePostId = (options, parentPost) => {
  const { parentForumAnswerId } = options.data;
  return parentForumAnswerId || parentPost.id;
};

export const savePost = (actionContext, { options, question, forumType, parentPost, isFollowing }) => {
  const targetId = getFluxiblePostId(options, parentPost);

  actionContext.dispatch('SET_SAVING_STATE', {
    savingState: savingStates.SAVING,
    id: targetId,
  });

  if (question) {
    if (isFollowing) {
      actionContext.dispatch('FOLLOW', { question });
    } else {
      actionContext.dispatch('UNFOLLOW', { question });
    }
  }
  savePostApi(options, forumType)
    .then((resp) => {
      unreadTracker.markRead(parentPost.questionId);
      actionContext.dispatch('RECEIVE_POST', {
        resp,
        data: options.data,
        parentPost,
        forumType,
      });
      actionContext.dispatch('SET_SAVING_STATE', {
        savingState: savingStates.SAVED,
        id: targetId,
      });
    })
    .fail((resp) =>
      actionContext.dispatch('SET_SAVING_STATE', {
        savingState: savingStates.ERROR,
        id: targetId,
        retry: options.data,
      })
    )
    .done();
};

export const upvote = (actionContext, { post }) => {
  upvoteApi(post)
    .then((resp) => actionContext.dispatch('UPVOTE', { post }))
    .fail((resp) => actionContext.dispatch('UPVOTE_ERROR', { post }))
    .done();
};

export const cancelUpvote = (actionContext, { post }) => {
  cancelUpvoteApi(post)
    .then((resp) => actionContext.dispatch('CANCEL_UPVOTE', { post }))
    .fail((resp) => actionContext.dispatch('UPVOTE_ERROR', { post }))
    .done();
};

export const follow = (actionContext, { question }) => {
  followApi(question)
    .then((resp) => actionContext.dispatch('FOLLOW', { question }))
    .fail((resp) => actionContext.dispatch('FOLLOW_ERROR', { question }))
    .done();
};

export const unfollow = (actionContext, { question }) => {
  unfollowApi(question)
    .then((resp) => actionContext.dispatch('UNFOLLOW', { question }))
    .fail((resp) => actionContext.dispatch('FOLLOW_ERROR', { question }))
    .done();
};
