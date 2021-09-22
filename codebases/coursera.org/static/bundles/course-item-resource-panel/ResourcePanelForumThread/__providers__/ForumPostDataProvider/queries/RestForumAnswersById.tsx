import React from 'react';
import { getAssignmentPostItemReplyLink } from 'bundles/course-item-resource-panel/ResourcePanelForumThread/__helpers__/forumLinkHelpers';
import PropTypes from 'prop-types';
import {
  AuthorProfile,
  Contributor,
  CreatorType,
  ForumPost,
  ForumAnswerLookupProps,
  ForumPostReply,
  ForumAnswersV1Response,
  PaginationProps,
} from '../__types__';
import ForumAnswerModel from '../models/ForumAnswer';

function toForumCardModel(props: ForumPostReply): ForumPost {
  return {
    answerBadge: undefined,
    content: { question: undefined, details: props.content },
    definition: props.content.definition,
    typeName: props.content.typeName,
    courseId: props.courseId,
    createdAt: props.createdAt,
    creatorId: props.creatorId,
    followCount: undefined,
    forumId: undefined,
    forumQuestionId: props.forumQuestionId,
    id: props.id,
    isFlagged: props.isFlagged,
    isFollowing: undefined,
    isUpvoted: props.isUpvoted,
    lastAnsweredAt: undefined,
    lastAnsweredBy: undefined,
    sessionId: undefined,
    state: props.state,
    topLevelAnswerCount: props.childAnswerCount,
    totalAnswerCount: props.childAnswerCount,
    upvoteCount: props.upvoteCount,
    userId: props.userId,
    viewCount: undefined,
  };
}

export type ForumPostWithCreator = ForumPost & CreatorType;

type ForumAnswersDataProviderResponse = {
  contributors?: Contributor[];
  replies?: ForumPostWithCreator[];
};
type Context = { forumId: string; courseId: string; questionId: string };

function extractCreator(response: ForumAnswersV1Response, creatorId: number): AuthorProfile | undefined {
  if (!response.ForumAnswersV1.linked || !response.ForumAnswersV1.linked.onDemandSocialProfilesV1) {
    return undefined;
  }
  return response.ForumAnswersV1.linked?.onDemandSocialProfilesV1?.find(
    (contributor: AuthorProfile) => contributor && contributor.userId === creatorId
  );
}

function extractReplies(response: ForumAnswersV1Response, context?: Context): (ForumPost & CreatorType)[] {
  const replies = response.ForumAnswersV1?.elements;
  if (replies && Array.isArray(replies)) {
    return replies.map((forumReply) => {
      const forumPost = toForumCardModel(forumReply);
      const creatorId = forumPost.creatorId;
      let deepLink = '';

      if (context) {
        deepLink = getAssignmentPostItemReplyLink(context.forumId, context.questionId, forumReply.forumAnswerId);
      }

      return {
        ...forumPost,
        creator: extractCreator(response, creatorId),
        deepLink,
      };
    });
  }
  return [] as ForumPost[];
}

const parseForumAnswersApiResponse = (
  response: ForumAnswersV1Response,
  context?: Context
): ForumAnswersDataProviderResponse => {
  if (!response || (response && !('ForumAnswersV1' in response))) {
    return {} as ForumAnswersDataProviderResponse;
  }
  return {
    replies: extractReplies(response, context),
  } as ForumAnswersDataProviderResponse;
};

class ForumAnswersProvider extends React.Component<ForumAnswerLookupProps & PaginationProps> {
  static contextTypes = {
    forumId: PropTypes.string,
    courseId: PropTypes.string,
    questionId: PropTypes.string,
  };

  render() {
    const { forumQuestionId, children, page, limit } = this.props;

    return (
      <ForumAnswerModel.Query id={forumQuestionId} page={page} limit={limit}>
        {({ loading, error, data }) => {
          if (loading || error) return children({ loading, error });

          if (data) {
            const answers = parseForumAnswersApiResponse(data, this.context);
            return children({ loading: false, error, data: answers });
          } else {
            return null;
          }
        }}
      </ForumAnswerModel.Query>
    );
  }
}

export const ForumAnswerByIdProvider: React.FC<ForumAnswerLookupProps & PaginationProps> = ({
  forumQuestionId,
  children,
  page,
  limit,
}) => {
  return (
    <ForumAnswerModel.QueryById id={forumQuestionId} page={page} limit={limit}>
      {({ loading, error, data }) => {
        if (loading || error) return children({ loading, error });

        if (data) {
          const answers = parseForumAnswersApiResponse(data);
          return children({ loading: false, error, data: answers });
        } else {
          return null;
        }
      }}
    </ForumAnswerModel.QueryById>
  );
};
export default ForumAnswersProvider;
