import { naptimeForumTypes } from 'bundles/discussions/constants';
import _ from 'underscore';

// TODO (dwinegar) when string serialization changes this will need to change
export default (parentPost, contextId, cml, forumType, isFollowingQuestion) => {
  const idData = {};

  if (forumType === naptimeForumTypes.mentorForumType) {
    idData.mentorForumQuestionId = `${contextId}~${parentPost.questionId}`;
  } else if (forumType === naptimeForumTypes.groupForumType) {
    idData.groupForumQuestionId = `${contextId}~${parentPost.questionId}`;
  } else if (forumType === naptimeForumTypes.gradedDiscussionPrompt) {
    idData.courseItemForumQuestionId = parentPost.questionId;
  } else {
    idData.courseForumQuestionId = `${contextId}~${parentPost.questionId}`;
  }

  idData.questionFollowOverrideOption = isFollowingQuestion;

  if (parentPost.type === 'answer') {
    if (forumType === naptimeForumTypes.gradedDiscussionPrompt) {
      idData.parentCourseItemForumAnswerId = _(parentPost.id.split('~')).rest().join('~');
    } else {
      idData.parentForumAnswerId = `${contextId}~${parentPost.topLevelForumAnswerId}`;
    }
  }

  return {
    data: {
      content: cml,
      ...idData,
    },
  };
};
