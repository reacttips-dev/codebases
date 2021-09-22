import { ForumPost, ForumQuestionsV1Resource } from '../../../__types__';

export function toForumPost({
  ForumQuestionsV1Resource: {
    elements: [first],
  },
}: ForumQuestionsV1Resource): ForumPost {
  return {
    children: [],
    dtdId: '',
    followCount: 0,
    forumAnswerBadgeTagMap: {},
    forumId: '',
    isFollowing: false,
    lastAnsweredAt: 0,
    lastAnsweredBy: 0,
    question: '',
    sessionId: '',
    state: {},
    topLevelAnswerCount: 0,
    value: '',
    viewCount: 0,
    ...first,
  };
}
