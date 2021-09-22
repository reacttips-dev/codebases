/* eslint-disable no-param-reassign */

import _ from 'underscore';

import createStore from 'vendor/cnpm/fluxible.v0-4/addons/createStore';
import getCurrentSocialProfile from 'pages/open-course/common/models/currentSocialProfile';
import { addAnswerFields, hydrateAnswers, hydrateQuestion } from 'bundles/discussions/utils/hydrateQuestionsAndAnswers';
import * as discussionConstants from 'bundles/discussions/constants';

const ANSWER_LIMIT = discussionConstants.answers.limitPerPage;
const COMMENT_LIMIT = discussionConstants.comments.limitPerPage;
const { loadingStates, answerSorts, defaults } = discussionConstants;

const getAnswerKey = function (page, sort) {
  return `${page}~${sort}`;
};

/**
 * Key for comments in the store. Currently just the page, but could later include sort.
 */
const getCommentKey = function (page) {
  return page;
};

const ThreadDetailsStore = createStore({
  storeName: 'ThreadDetailsStore',

  initialize() {
    this.data = {};
    this.comments = {};
    this.pageCount = {};
    this.commentPageCount = {};
    this.commentPageRange = {};
    this.savingStates = {};
    this.answerToInsert = null;
    this.questionLoadingState = {};
    this.answerLoadingState = {};
    this.commentLoadingState = {};
    this.forumType = undefined;
    this.highlightedPosts = {};
    this.retryCml = {};
  },

  getUserId() {
    return this.dispatcher.getStore('ApplicationStore').getUserData().id;
  },

  getQuestion(questionId) {
    return this.data[questionId] && this.data[questionId].thread;
  },

  getHighlightedPost(questionId) {
    return this.highlightedPosts[questionId];
  },

  getReplies(questionId, page, sort) {
    const key = getAnswerKey(page, sort);
    return this.data[questionId] && this.data[questionId][key];
  },

  getLoadedComments(answerId) {
    const comments = this.comments[answerId];

    if (comments) {
      return _(comments).chain().values().flatten().reverse().value();
    }

    return undefined;
  },

  getCommentPageRange(answerId) {
    return {
      totalPageCount: this.commentPageCount[answerId],
      startPage: this.commentPageRange[answerId] && this.commentPageRange[answerId].startPage,
      endPage: this.commentPageRange[answerId] && this.commentPageRange[answerId].endPage,
    };
  },

  getPageCount(questionId, page, sort) {
    const key = getAnswerKey(page, sort);
    return this.pageCount[questionId + key];
  },

  /**
    @param post a post Object (question, answer, or comment)
    @returns array of matching posts (duplicates come from our caching strategy)
   */
  findPosts(post, includeHighlighted) {
    let posts = [];

    if (post.type === 'question') {
      posts = [this.data[post.questionId].thread];
    } else if (post.type === 'answer') {
      const entries = this.data[post.questionId];

      posts = _(entries).reduce((accum, entry) => {
        const match = _(entry).findWhere({ id: post.id });
        if (match) accum.push(match);
        return accum;
      }, []);
    } else if (post.type === 'comment') {
      posts = [
        _(this.getLoadedComments(post.topLevelForumAnswerId)).findWhere({
          id: post.id,
        }),
      ];
    }

    if (includeHighlighted) {
      const highlightedPost = this.highlightedPosts[post.questionId];

      if (highlightedPost) {
        posts.push(highlightedPost);
      }
    }

    return posts;
  },

  isLoaded({ questionId, page, sort }) {
    const key = getAnswerKey(page, sort);
    const hasQuestion = !!this.data[questionId];

    if (hasQuestion) {
      if (!(key in this.data[questionId])) {
        return false;
      }
      const answers = this.data[questionId][key];
      const hasAnswer = !!answers;
      if (hasAnswer) {
        const commentsHaveLoaded = _(answers).every((ans) => {
          return ans.childAnswerCount > 0 ? this.comments[ans.topLevelForumAnswerId] : true;
        });
        return commentsHaveLoaded;
      } else {
        return true;
      }
    } else {
      return false;
    }
  },

  getAnswerLoadedState({ questionId, page, sort }) {
    return this.answerLoadingState[questionId + sort + page];
  },

  isHighlighted(post) {
    const highlightedPost = this.highlightedPosts[post.questionId];
    return highlightedPost && highlightedPost.id === post.id;
  },

  loadAnswersHelper(hydratedAnswers, topLevelAnswerCount, questionId, page, sort) {
    if (!this.data[questionId]) {
      this.data[questionId] = {};
    }

    const key = getAnswerKey(page, sort);
    this.data[questionId][key] = hydratedAnswers;
    this.pageCount[questionId + key] = Math.ceil(topLevelAnswerCount / ANSWER_LIMIT);

    // Insert the user's new answer, if it's not in the page from the backend
    if (
      this.answerToInsert &&
      this.answerToInsert.questionId === questionId &&
      page === 1 &&
      sort === answerSorts.newestSort
    ) {
      const answerAlreadyPresent = !!_(this.data[questionId][key]).findWhere({
        id: this.answerToInsert.id,
      });
      if (!answerAlreadyPresent) {
        this.data[questionId][key].unshift(this.answerToInsert);
      }
      this.answerToInsert = null;
    }
  },

  loadCommentsHelper(hydratedComments, answerId, page) {
    if (!this.comments[answerId]) {
      this.comments[answerId] = {};
    }

    if (!this.commentPageRange[answerId]) {
      this.commentPageRange[answerId] = {
        startPage: page,
        endPage: page,
      };
    }

    const key = getCommentKey(page);
    this.comments[answerId][key] = hydratedComments;
  },

  loadHighlightedPostHelper(post, questionId) {
    post.highlighted = true;
    this.highlightedPosts[questionId] = post;
  },
});

ThreadDetailsStore.handlers = {
  LOAD_QUESTION({ response, questionId, forumType }) {
    if (!this.data[questionId]) {
      this.data[questionId] = {};
    }

    const { question, answers, highlightedPost } = hydrateQuestion(response, forumType);

    this.data[questionId].thread = question;
    this.forumType = forumType;

    if (highlightedPost) {
      this.loadHighlightedPostHelper(highlightedPost, questionId);
    }

    if (answers) {
      const topLevelAnswers = answers
        .filter((potentialAnswers) => potentialAnswers.type === 'answer')
        .sort((left, right) => left.order - right.order);
      this.loadAnswersHelper(topLevelAnswers, question.topLevelAnswerCount, questionId, 1, defaults.detailSort);

      answers.forEach((answer) => {
        const forumAnswerId = answer.topLevelForumAnswerId;

        if (answer.childAnswerCount > 0) {
          const comments = answers
            .filter(
              (potentialAnswers) =>
                potentialAnswers.topLevelForumAnswerId === forumAnswerId && potentialAnswers.type === 'comment'
            )
            .sort((left, right) => left.order - right.order);

          this.loadCommentsHelper(comments, forumAnswerId, 1);
          this.commentLoadingState[forumAnswerId] = loadingStates.DONE;
          this.commentPageCount[forumAnswerId] = Math.ceil(answer.childAnswerCount / COMMENT_LIMIT);
        }

        this.commentLoadingState[forumAnswerId] = loadingStates.DONE;
      });
    }

    this.answerLoadingState[questionId + defaults.detailSort + 1] = loadingStates.DONE;

    this.data[questionId].thread.questionId = questionId;
    this.data[questionId].thread.type = 'question';
    this.emitChange();
  },

  LOAD_ANSWERS_WITH_COMMENTS({ response, questionId, page, sort, forumType }) {
    if (!this.forumType) {
      this.forumType = forumType;
    }

    const answers = hydrateAnswers(response, this.forumType, questionId);
    const topLevelAnswers = answers
      .filter((potentialAnswers) => potentialAnswers.type === 'answer')
      .sort((left, right) => left.order - right.order);

    this.loadAnswersHelper(topLevelAnswers, response.paging.total, questionId, page, sort);

    answers.forEach((answer) => {
      const forumAnswerId = answer.topLevelForumAnswerId;
      if (answer.childAnswerCount > 0) {
        const comments = answers
          .filter(
            (potentialAnswers) =>
              potentialAnswers.topLevelForumAnswerId === forumAnswerId && potentialAnswers.type === 'comment'
          )
          .sort((left, right) => left.order - right.order);

        this.loadCommentsHelper(comments, forumAnswerId, 1);
        this.commentPageCount[forumAnswerId] = Math.ceil(answer.childAnswerCount / COMMENT_LIMIT);
      }

      this.commentLoadingState[forumAnswerId] = loadingStates.DONE;
    });

    this.answerLoadingState[questionId + sort + page] = loadingStates.DONE;

    this.emitChange();
  },

  LOAD_COMMENT_PAGES({ response, questionId, answerId, startPage }) {
    if (!this.comments[answerId]) {
      this.comments[answerId] = {};
    }

    const length = Math.ceil(response.elements.length / COMMENT_LIMIT);
    const endPage = startPage + (length - 1);

    this.commentPageCount[answerId] = Math.ceil(response.paging.total / COMMENT_LIMIT);

    if (!this.commentPageRange[answerId]) {
      this.commentPageRange[answerId] = {
        startPage: Infinity,
        endPage: 1,
      };
    }

    if (startPage < (this.commentPageRange[answerId].startPage || Infinity)) {
      this.commentPageRange[answerId].startPage = startPage;
    }

    if (endPage > this.commentPageRange[answerId].endPage) {
      this.commentPageRange[answerId].endPage = endPage;
    }

    const pagedResponses = _.range(0, length).map((pageNumber) => {
      const pageResponseElements = response.elements.slice(
        COMMENT_LIMIT * pageNumber,
        COMMENT_LIMIT * (pageNumber + 1)
      );

      return Object.assign({}, response, {
        elements: pageResponseElements,
      });
    });

    pagedResponses.forEach((pagedResponse, index) => {
      const page = index + startPage;

      this.loadCommentsHelper(hydrateAnswers(pagedResponse, this.forumType, questionId), answerId, page);
    });

    this.commentLoadingState[answerId] = loadingStates.DONE;

    this.emitChange();
  },

  RECEIVE_POST({ resp, data, parentPost, questionId, forumType }) {
    const newPostWithoutFields = Object.assign({}, resp.elements[0], {
      creator: getCurrentSocialProfile().attributes,
    });

    const newPost = addAnswerFields(forumType, newPostWithoutFields, parentPost.questionId);

    if (parentPost.type === 'answer') {
      const forumAnswerId = parentPost.topLevelForumAnswerId;

      if (!this.comments[forumAnswerId]) {
        this.comments[forumAnswerId] = {};
      }

      if (!this.comments[forumAnswerId][1]) {
        this.comments[forumAnswerId][1] = [];
      }

      this.comments[forumAnswerId][1].unshift(newPost);

      if (!this.commentPageCount[forumAnswerId]) {
        this.commentPageCount[forumAnswerId] = 1;
      }

      if (!this.commentPageRange[forumAnswerId]) {
        this.commentPageRange[forumAnswerId] = {
          startPage: 1,
          endPage: 1,
        };
      }

      this.findPosts(parentPost).forEach((entry) => {
        entry.childAnswerCount += 1;
      });

      this.commentLoadingState[forumAnswerId] = loadingStates.DONE;
      this.emitChange();
    } else {
      if (parentPost) {
        this.findPosts(parentPost).forEach((entry) => {
          if (entry && entry.topLevelAnswerCount !== undefined) {
            entry.topLevelAnswerCount += 1;
          }
        });
      }
      this.answerToInsert = newPost;
    }
  },

  SHOW_REPLY_EDITOR({ reply, reason, dontNotify }) {
    if (reply.highlighted) {
      reply.showEditor = true;
      reply.editReason = reason;
      reply.dontNotify = dontNotify;
    } else {
      this.findPosts(reply).forEach((post) => {
        post.showEditor = true;
        post.editReason = reason;
        post.dontNotify = dontNotify;
      });
    }

    this.emitChange();
  },

  HIDE_REPLY_EDITOR({ reply }) {
    if (reply.highlighted) {
      reply.showEditor = false;
      reply.editReason = '';
      reply.dontNotify = false;
    } else {
      this.findPosts(reply).forEach((post) => {
        post.showEditor = false;
        post.editReason = '';
        post.dontNotify = false;
      });
    }

    this.emitChange();
  },

  EDIT_REPLY({ reply, content }) {
    this.findPosts(reply, true).forEach((post) => {
      post.content = content;
      post.state.edited = {};
      post.state.edited.userId = this.getUserId();
    });

    this.emitChange();
  },

  EDIT_THREAD({ questionId, question, details }) {
    const { thread } = this.data[questionId];

    thread.content.question = question;
    thread.content.details = details;
    thread.state.edited = {};
    thread.state.edited.userId = this.getUserId();

    this.emitChange();
  },

  DELETE_POST({ post }) {
    this.findPosts(post, true).forEach((entry) => {
      entry.hide = true;
      entry.state.deleted = {};
      entry.state.deleted.userId = this.getUserId();
    });

    this.emitChange();
  },

  SOFT_DELETE_POST({ post }) {
    this.findPosts(post, true).forEach((entry) => {
      entry.state.deleted = {};
      entry.state.deleted.userId = this.getUserId();
    });

    this.emitChange();
  },

  UNDO_DELETE({ post }) {
    this.findPosts(post, true).forEach((entry) => {
      entry.state.deleted = null;
    });

    this.emitChange();
  },

  FLAG_POST({ post }) {
    this.findPosts(post, true).forEach((entry) => {
      if (entry.flagDetails) {
        entry.flagDetails.isActive = true;
      } else {
        entry.flagDetails = {
          isActive: true,
        };
      }
    });

    this.emitChange();
  },

  UNFLAG_POST({ post }) {
    this.findPosts(post, true).forEach((entry) => {
      entry.flagDetails.isActive = false;
    });

    this.emitChange();
  },

  SHOW_ADMIN_DETAILS({ post }) {
    if (post.highlighted) {
      post.showAdminDetails = true;
    } else {
      this.findPosts(post).forEach((entry) => {
        entry.showAdminDetails = true;
      });
    }

    this.emitChange();
  },

  HIDE_ADMIN_DETAILS({ post }) {
    if (post.highlighted) {
      post.showAdminDetails = false;
    } else {
      this.findPosts(post).forEach((entry) => {
        entry.showAdminDetails = false;
      });
    }

    this.emitChange();
  },

  UPVOTE({ post }) {
    this.findPosts(post, true).forEach((entry) => {
      entry.isUpvoted = true;

      if (entry.upvotes !== undefined) {
        entry.upvotes += 1;
      } else {
        entry.upvoteCount += 1;
      }

      entry.upvoteError = false;
    });

    this.emitChange();
  },

  CANCEL_UPVOTE({ post }) {
    this.findPosts(post, true).forEach((entry) => {
      entry.isUpvoted = false;

      if (entry.upvotes !== undefined) {
        entry.upvotes -= 1;
      } else {
        entry.upvoteCount -= 1;
      }

      entry.upvoteError = false;
    });

    this.emitChange();
  },

  UPVOTE_ERROR({ post }) {
    this.findPosts(post, true).forEach((entry) => {
      entry.upvoteError = true;
    });

    this.emitChange();
  },

  FOLLOW({ question }) {
    const { thread } = this.data[question.questionId];

    if (!thread) {
      return;
    }

    thread.isFollowing = true;

    if (thread.followerCount === undefined) {
      thread.followCount += 1;
    } else {
      thread.followerCount += 1;
    }

    thread.followError = false;
    this.emitChange();
  },

  UNFOLLOW({ question }) {
    const { thread } = this.data[question.questionId];

    if (!thread) {
      return;
    }

    thread.isFollowing = false;

    if (thread.followerCount === undefined) {
      thread.followCount -= 1;
    } else {
      thread.followerCount -= 1;
    }

    thread.followError = false;
    this.emitChange();
  },

  HIGHLIGHT({ post }) {
    this.loadHighlightedPostHelper(Object.assign({}, post), post.questionId);
    this.emitChange();
  },

  UNHIGHLIGHT({ post }) {
    delete this.highlightedPosts[post.questionId];
    this.emitChange();
  },

  FOLLOW_ERROR({ question }) {
    const { thread } = this.data[question.questionId];
    thread.followError = true;

    this.emitChange();
  },

  SET_SAVING_STATE({ savingState, id, retry }) {
    this.savingStates[id] = savingState;
    this.retryCml[id] = retry;

    this.emitChange();
  },

  UNSET_QUESTION({ questionId }) {
    this.data[questionId] = {};
    this.emitChange();
  },

  QUESTION_LOADING_STATE({ questionId, loadingState }) {
    this.questionLoadingState[questionId] = loadingState;
    this.emitChange();
  },

  ANSWER_LOADING_STATE({ questionId, sort, page, loadingState }) {
    this.answerLoadingState[questionId + sort + page] = loadingState;
    this.emitChange();
  },

  COMMENT_LOADING_STATE({ answerId, loadingState }) {
    this.commentLoadingState[answerId] = loadingState;
    this.emitChange();
  },
};

export default ThreadDetailsStore;
