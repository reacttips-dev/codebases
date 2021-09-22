import API from 'bundles/phoenix/lib/apiWrapper';
import { naptimeForumTypes } from 'bundles/discussions/constants';

const courseFollowApi = API('/api/onDemandCourseForumQuestionFollowings.v1/', {
  type: 'rest',
});

const mentorFollowApi = API('/api/onDemandMentorForumQuestionFollowings.v1/', {
  type: 'rest',
});

const groupFollowApi = API('/api/onDemandGroupForumQuestionFollowings.v1/', {
  type: 'rest',
});

const chooseApi = (forumType) => {
  switch (forumType) {
    case naptimeForumTypes.mentorForumType:
      return mentorFollowApi;
    case naptimeForumTypes.groupForumType:
      return groupFollowApi;
    default:
      return courseFollowApi;
  }
};

export const follow = (post) => {
  return chooseApi(post.forumType).put(post.id);
};

export const unfollow = (post) => {
  return chooseApi(post.forumType).delete(post.id);
};
