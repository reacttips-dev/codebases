import API from 'bundles/phoenix/lib/apiWrapper';
import { naptimeForumTypes } from 'bundles/discussions/constants';

export const onDemandCourseForumQuestions = API('/api/onDemandCourseForumQuestions.v1/', {
  type: 'rest',
});

export const onDemandCourseForumAnswers = API('/api/onDemandCourseForumAnswers.v1/', {
  type: 'rest',
});

export const onDemandMentorForumQuestions = API('/api/onDemandMentorForumQuestions.v1/', {
  type: 'rest',
});

export const onDemandMentorForumAnswers = API('/api/onDemandMentorForumAnswers.v1/', {
  type: 'rest',
});

export const onDemandGroupForumQuestions = API('/api/onDemandGroupForumQuestions.v1/', {
  type: 'rest',
});

export const onDemandGroupForumAnswers = API('/api/onDemandGroupForumAnswers.v1/', {
  type: 'rest',
});

export const onDemandDiscussionPromptAnswers = API('/api/onDemandDiscussionPromptAnswers.v1/', {
  type: 'rest',
});

export const getQuestionApi = (forumType) => {
  if (forumType === naptimeForumTypes.mentorForumType) {
    return onDemandMentorForumQuestions;
  } else if (forumType === naptimeForumTypes.groupForumType) {
    return onDemandGroupForumQuestions;
  } else {
    return onDemandCourseForumQuestions;
  }
};

export const getAnswerApi = (forumType) => {
  if (forumType === naptimeForumTypes.mentorForumType) {
    return onDemandMentorForumAnswers;
  } else if (forumType === naptimeForumTypes.groupForumType) {
    return onDemandGroupForumAnswers;
  } else if (forumType === naptimeForumTypes.gradedDiscussionPrompt) {
    return onDemandDiscussionPromptAnswers;
  } else {
    return onDemandCourseForumAnswers;
  }
};
