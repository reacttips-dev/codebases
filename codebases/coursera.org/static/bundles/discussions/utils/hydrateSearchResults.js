import _ from 'underscore';

/*
 * See hydrateQuestionsAndAnswers.addAnswerFields for further explanation of the id fields for search results.
 *
 * @returns search result, with the following fields:
 *   - questionId: uncombined UUID of the question (not combined with the course/group, forum, etc)
 *   - topLevelForumAnswerId (optional): if search result is an answer or a comment, the uncombined UUID of the
 *       top-level (or parent) answer
 *   - forumCommentId (optional): if search result is a comment, the uncombined UUID of the comment
 */

/* eslint-disable import/prefer-default-export */
export const hydrateSearchResults = function (naptimeResponse) {
  return naptimeResponse.elements.map((item) => {
    let questionId;
    let answerId;
    let parentForumAnswerId;
    // questionId
    if (item.courseForumQuestionId) {
      questionId = item.courseForumQuestionId.split('~')[1];
    } else if (item.groupForumQuestionId) {
      questionId = item.groupForumQuestionId.split('~')[1];
    }
    // answerId
    if (item.courseForumAnswerId) {
      answerId = item.courseForumAnswerId.split('~')[1];
    } else if (item.groupForumAnswerId) {
      answerId = item.groupForumAnswerId.split('~')[1];
    }
    // parent answerId if it is a comment
    if (item.parentForumAnswerId) {
      parentForumAnswerId = item.parentForumAnswerId.split('~')[1];
    }

    let creator;
    let lastAnsweredBy;
    _(naptimeResponse.linked['onDemandSocialProfiles.v1']).each(function (profile) {
      if (item.creatorId && item.creatorId === profile.learnerId) {
        creator = profile;
      }
      if (item.lastAnsweredBy && item.lastAnsweredBy === profile.learnerId) {
        lastAnsweredBy = profile;
      }
    });

    return Object.assign(item, {
      questionId,
      topLevelForumAnswerId: parentForumAnswerId || answerId,
      forumCommentId: parentForumAnswerId ? answerId : undefined,
      creator: creator || item.creator,
      lastAnsweredBy: lastAnsweredBy || item.lastAnsweredBy,
    });
  });
};
