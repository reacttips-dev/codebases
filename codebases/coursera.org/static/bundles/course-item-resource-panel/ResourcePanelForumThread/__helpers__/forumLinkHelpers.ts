import path from 'js/lib/path';
import constants from 'pages/open-course/common/constants';

export const getForumLink = function (forumId: $TSFixMe) {
  return path.join(constants.courseRootPath, 'discussions', 'forums', forumId);
};

export const getAssignmentPostItemLink = function (forumId: $TSFixMe, threadId: $TSFixMe) {
  return `${getForumLink(forumId)}/threads/${threadId}`;
};

export const getAssignmentPostItemReplyLink = function (forumId: $TSFixMe, threadId: $TSFixMe, commentId: $TSFixMe) {
  return `${getForumLink(forumId)}/threads/${threadId}/replies/${commentId}`;
};

export const getDeepLink = function (urlPrefix: $TSFixMe, searchResult: $TSFixMe) {
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
