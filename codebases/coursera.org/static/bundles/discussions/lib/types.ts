import { CmlContent } from 'bundles/cml/types/Content';

export type Profile = {
  fullName?: string;
  userId: number;
  externalUserId: string;
};

export enum CourseRole {
  'LEARNER',
  'MENTOR',
  'NOT_ENROLLED',
  'PRE_ENROLLED_LEARNER',
  'BROWSER',
  'COURSE_ASSISTANT',
  'TEACHING_STAFF',
  'UNIVERSITY_ADMIN',
  'DATA_COORDINATOR',
}

export type AuthorProfile = {
  id: string;
  fullName: string;
  photoUrl?: string;
  learnerId: number;
  externalUserId: string;
  helperStatus?: string;
  courseRole?: string;
  userId?: number;
};

export type Contributor = AuthorProfile & {
  userId: number;
  isDefaultPhoto?: boolean;
  courseRole?: string;
  helperStatus?: string;
  postsCount?: string;
  votesReceivedCount?: string;
};

export type ForumType = {
  typeName: ForumTypeName;
  definition: any;
};

export enum ForumTypeName {
  'weekForumType',
  'itemForumType',
  'rootForumType',
  'customForumType',
  'groupForumType',
  'mentorForumType',
  'gradedDiscussionPrompt',
}

export type PostId = string;

type PostReplyId = string;

type PostReplyCommentId = string;

export type Forum = {
  id: string;
  title: string;
  forumType: ForumType;
};

type AnswerBadge = {};

export type ForumPost = {
  id: PostId;
  content: CmlContent;
  state: string;
  creatorId: AuthorProfile['id'];
  createdAt: number;
  forumId: Forum['id'];
  sessionId: string;
  lastAnsweredBy: Contributor['id'];
  lastAnsweredAt: number;
  upvoteCount: number;
  followCount: number;
  totalAnswerCount: number;
  topLevelAnswerCount: number;
  viewCount: number;
  isFlagged: boolean;
  isFollowing: boolean;
  isUpvoted: boolean;
  answerBadge: AnswerBadge;
};

export type ForumPostReply = {
  createdAt: number;
  creatorId: number;
  isUpvoted: boolean;
  id: PostReplyId;
  content: CmlContent;
  upvoteCount: number;
  childAnswerCount: number;
  isFlagged: boolean;
  creator: AuthorProfile;
  forumType: ForumType;
  topLevelForumAnswerId: PostReplyId;
  forumCommentId: PostReplyCommentId;
  type: ForumTypeName;
  order: number;
  questionId: string;
  highlighted: boolean;
};

export type ForumPostReplies = ForumPostReply[];

export type ForumPostRepliesComment = {};

export type ForumPostRepliesComments = ForumPostRepliesComment[];

type ForumPostCreator = {
  courseId: string;
  courseRole: string;
  externalUserId: string;
  fullName: string;
  id: string;
  learnerId: number;
  userId: number;
};

export type ForumQuestionFromStore = {
  answerBadge: {
    answerBadge: string;
  };
  content: {
    details: {
      typeName: string;
      definition: {
        dtdId: string;
        value: string;
      };
    };
    question: string;
  };
  courseId: string;
  createdAt: number;
  creator: ForumPostCreator;
  creatorId: number;
  followCount: number;
  followError: boolean;
  forumAnswerBadgeTagMap: any;
  forumId: string;
  forumQuestionId: string;
  forumType: string;
  id: string;
  isFlagged: boolean;
  isFollowing: boolean;
  isUpvoted: boolean;
  lastAnsweredAt: number;
  lastAnsweredBy: ForumPostCreator;
  questionId: string;
  sessionId: string;
  state: any;
  topLevelAnswerCount: number;
  totalAnswerCount: number;
  type: string;
  upvoteCount: number;
  userId: number;
  viewCount: number;
};
