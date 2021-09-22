import API from 'bundles/phoenix/lib/apiWrapper';
import { naptimeForumTypes } from 'bundles/discussions/constants';

const courseUpvoteQuestionApi = API('/api/onDemandCourseForumQuestionVotes.v1/', {
  type: 'rest',
});

const courseUpvoteAnswerApi = API('/api/onDemandCourseForumAnswerVotes.v1/', {
  type: 'rest',
});

const mentorUpvoteQuestionApi = API('/api/onDemandMentorForumQuestionVotes.v1/', {
  type: 'rest',
});

const mentorUpvoteAnswerApi = API('/api/onDemandMentorForumAnswerVotes.v1/', {
  type: 'rest',
});

const groupUpvoteQuestionApi = API('/api/onDemandGroupForumQuestionVotes.v1/', {
  type: 'rest',
});

const groupUpvoteAnswerApi = API('/api/onDemandGroupForumAnswerVotes.v1/', {
  type: 'rest',
});

const gradedDiscussionPromptAnswerApi = API('/api/onDemandDiscussionPromptAnswerVotes.v1', {
  type: 'rest',
});

const chooseApi = (post, forumType) => {
  const isQuestion = post.type === 'question';
  switch (forumType) {
    case naptimeForumTypes.mentorForumType:
      return isQuestion ? mentorUpvoteQuestionApi : mentorUpvoteAnswerApi;
    case naptimeForumTypes.groupForumType:
      return isQuestion ? groupUpvoteQuestionApi : groupUpvoteAnswerApi;
    case naptimeForumTypes.gradedDiscussionPrompt:
      return gradedDiscussionPromptAnswerApi;
    default:
      return isQuestion ? courseUpvoteQuestionApi : courseUpvoteAnswerApi;
  }
};

export const upvote = (post) => {
  return chooseApi(post, post.forumType).put(post.id);
};

export const cancelUpvote = (post) => {
  return chooseApi(post, post.forumType).delete(post.id);
};
