import path from 'js/lib/path';
import constants from 'pages/open-course/common/constants';

export const getPathname = () => window.location.pathname;

export const getCourseRootPath = function (courseSlug) {
  return path.join(constants.learnRoot, courseSlug);
};

export const buildUrlForDiscussionPrompt = function (answerId) {
  const url = getPathname();
  return url + '?answerId=' + answerId;
};

export const buildUrl = function (baseUrl, questionId, answerId, commentId) {
  let newUrl = baseUrl;
  if (questionId) {
    newUrl = path.join(newUrl, 'threads', questionId);
  }
  if (answerId) {
    newUrl = path.join(newUrl, 'replies', answerId);
  }
  if (commentId) {
    newUrl = path.join(newUrl, 'comments', commentId);
  }
  return newUrl;
};

export const getLearnerDetailedViewLink = function (userId) {
  return path.join(constants.courseAdminPath, 'forum-learner', userId, 'grades');
};

export const getProfileLink = function (externalUserId) {
  return path.join(constants.courseRootPath, 'profiles', externalUserId);
};

export const getGroupForumLink = function (groupId) {
  return path.join(constants.courseRootPath, 'discussions', 'groups', groupId);
};

export const getWeekDiscussionsUrl = function (week) {
  return path.join(constants.courseRootPath, 'discussions', 'weeks', week);
};

export const getCourseDiscussionsUrl = () => path.join(constants.learnCoursePath, 'discussions');

export const getCourseDiscussionsSearchUrl = () => path.join(constants.learnCoursePath, 'discussions', 'search');

export const getCourseDiscussionsTabUrl = path.join.bind(null, constants.learnCoursePath, 'discussions', 'tab');

export const getAllThreadsDiscussionsUrl = () => path.join(constants.learnCoursePath, 'discussions', 'all');

export const getEmbeddedItemDiscussionsUrl = function (itemMetadata) {
  return path.join(itemMetadata.getLink(), 'discussions');
};

export const getForumLink = function (forumId) {
  return path.join(constants.courseRootPath, 'discussions', 'forums', forumId);
};

export function getCourseHomeLinkBySlug(slug) {
  return `/learn/${slug}/home/welcome`;
}

export const getAssignmentPostItemLink = function (forumId, threadId) {
  return `${getForumLink(forumId)}/threads/${threadId}`;
};

export const getAssignmentPostItemReplyLink = function (forumId, threadId, commentId) {
  return `${getForumLink(forumId)}/threads/${threadId}/replies/${commentId}`;
};

export const getDeepLink = function (urlPrefix, searchResult) {
  let link = path.join(urlPrefix, 'threads', searchResult.questionId);
  if (searchResult.forumCommentId) {
    link = path.join(link, 'replies', searchResult.forumCommentId, 'comments', searchResult.topLevelForumAnswerId);
  } else if (searchResult.topLevelForumAnswerId) {
    link = path.join(link, 'replies', searchResult.topLevelForumAnswerId);
  } else if (searchResult.forumId && searchResult.questionId && urlPrefix.match(/learn\/.*\/discussions$/)) {
    link = getAssignmentPostItemLink(searchResult.forumId, searchResult.questionId);
  }
  return link;
};
