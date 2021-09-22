import { naptimeForumTypes } from 'bundles/discussions/constants';

const questionFields = [
  'content',
  'state',
  'creatorId',
  'createdAt',
  'forumId',
  'sessionId',
  'lastAnsweredBy',
  'lastAnsweredAt',
  'upvoteCount',
  'followCount',
  'totalAnswerCount',
  'topLevelAnswerCount',
  'viewCount',
  'isFlagged',
  'isFollowing',
  'isUpvoted',
  'answerBadge',
];

const answerFields = [
  'content',
  'forumQuestionId',
  'parentForumAnswerId',
  'state',
  'creatorId',
  'createdAt',
  'order',
  'upvoteCount',
  'childAnswerCount',
  'isFlagged',
  'isUpvoted',
  'courseItemForumQuestionId',
  'parentCourseItemForumAnswerId',
];

const exported = {
  getParamsForForumType: (forumType, forumId) => {
    if (forumType === naptimeForumTypes.mentorForumType) {
      return {
        q: 'byMentorForumId',
        mentorForumId: forumId,
      };
    } else if (forumType === naptimeForumTypes.groupForumType) {
      return {
        q: 'byGroupForumId',
        groupForumId: forumId,
      };
    }
    return {
      q: 'byCourseForumId',
      courseForumId: forumId,
    };
  },

  getAnswerApiName: (forumType) => {
    if (forumType === naptimeForumTypes.mentorForumType) {
      return 'onDemandMentorForumAnswers.v1';
    } else if (forumType === naptimeForumTypes.groupForumType) {
      return 'onDemandGroupForumAnswers.v1';
    } else if (forumType === naptimeForumTypes.gradedDiscussionPrompt) {
      return 'onDemandDiscussionPromptAnswers.v1';
    }
    return 'onDemandCourseForumAnswers.v1';
  },

  questionFields,
  questionIncludes: ['profiles', 'userId'],
  answerFields,
  answerIncludes: ['profiles', 'children', 'userId'],
  profilesFields: ['userId', 'externalUserId', 'fullName', 'photoUrl', 'courseRole'],
};

export default exported;
export { questionFields, answerFields };

export const { getParamsForForumType, getAnswerApiName, questionIncludes, answerIncludes, profilesFields } = exported;
