import API from 'bundles/phoenix/lib/apiWrapper';
import { naptimeForumTypes } from 'bundles/discussions/constants';

const courseFlagQuestionApi = API('/api/onDemandCourseForumQuestionFlags.v1/', {
  type: 'rest',
});

const courseFlagAnswerApi = API('/api/onDemandCourseForumAnswerFlags.v1/', {
  type: 'rest',
});

const mentorFlagQuestionApi = API('/api/onDemandMentorForumQuestionFlags.v1/', {
  type: 'rest',
});

const mentorFlagAnswerApi = API('/api/onDemandMentorForumAnswerFlags.v1/', {
  type: 'rest',
});

const groupFlagQuestionApi = API('/api/onDemandGroupForumQuestionFlags.v1/', {
  type: 'rest',
});

const groupFlagAnswerApi = API('/api/onDemandGroupForumAnswerFlags.v1/', {
  type: 'rest',
});

const gradedDiscussionPromptApi = API('/api/onDemandDiscussionPromptAnswerFlags.v1/', {
  type: 'rest',
});

const chooseApi = (post, forumType) => {
  const isQuestion = post.type === 'question';
  switch (forumType) {
    case naptimeForumTypes.mentorForumType:
      return isQuestion ? mentorFlagQuestionApi : mentorFlagAnswerApi;
    case naptimeForumTypes.groupForumType:
      return isQuestion ? groupFlagQuestionApi : groupFlagAnswerApi;
    case naptimeForumTypes.gradedDiscussionPrompt:
      return gradedDiscussionPromptApi;
    default:
      return isQuestion ? courseFlagQuestionApi : courseFlagAnswerApi;
  }
};

export const flagPost = (post) => {
  return chooseApi(post, post.forumType).put(post.id);
};

export const unflagPost = (post) => {
  return chooseApi(post, post.forumType).delete(post.id);
};
