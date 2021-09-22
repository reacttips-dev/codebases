import React from 'react';
import PropTypes from 'prop-types';
import { extractForumPostId } from '../../../__helpers__/forumPostDataHelpers';
import {
  AuthorProfile,
  Contributor,
  ForumPost,
  ForumPostWithCreator,
  ForumAnswerLookupProps,
  ForumPostReply,
  ForumAnswersV1Response,
  PaginationProps,
  CreatorType,
} from '../__types__';
import ForumAnswerModel, { AnswerSorts } from '../models/ForumAnswer';
import { answerSorts } from 'bundles/discussions/constants';
import { getAssignmentPostItemReplyLink } from 'bundles/discussions/utils/discussionsUrl';

export function toForumCardModel(props: ForumPostReply & CreatorType): ForumPostWithCreator {
  return {
    answerBadge: undefined,
    content: { question: undefined, details: props.content },
    definition: props.content.definition,
    dontNotify: props.dontNotify,
    typeName: props.content.typeName,
    courseId: props.courseId,
    createdAt: props.createdAt,
    creatorId: props.creatorId,
    forumCommentId: props.forumCommentId,
    editReason: props.editReason,
    followCount: undefined,
    forumId: undefined,
    forumQuestionId: props.forumQuestionId,
    id: props.id,
    questionId: extractForumPostId(props.forumQuestionId),
    answerId: props.forumAnswerId,
    hide: props.hide,
    isFlagged: props.isFlagged,
    isFollowing: undefined,
    isUpvoted: props.isUpvoted,
    lastAnsweredAt: undefined,
    lastAnsweredBy: undefined,
    sessionId: undefined,
    showEditor: props.showEditor,
    state: props.state,
    topLevelAnswerCount: props.childAnswerCount,
    totalAnswerCount: props.childAnswerCount,
    upvoteCount: props.upvoteCount,
    userId: props.userId,
    viewCount: undefined,
    creator: props.creator,
    type: props.type,
    topLevelForumAnswerId: props.topLevelForumAnswerId,
  };
}

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

function extractReplies(response: ForumAnswersV1Response, context?: Context) {
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

export type ThreadDetailsStoreResponseProps = {
  isQuestionLoaded: boolean;
  loadingState: string;
  page: number;
  pageCount: number;
  questionId: string;
  replies: (ForumPostReply & CreatorType)[];
  savingStates: any;
  sort: AnswerSorts;
};

class ForumAnswersProvider extends React.Component<ForumAnswerLookupProps & PaginationProps> {
  static contextTypes = {
    forumId: PropTypes.string,
    courseId: PropTypes.string,
    questionId: PropTypes.string,
  };

  render() {
    const { forumQuestionId, children, page, limit, sortOrder } = this.props;
    const defaultSortOrder = answerSorts.newestSort;

    const questionId = extractForumPostId(forumQuestionId);

    return (
      <ForumAnswerModel.Query id={questionId} page={page} limit={limit} sortOrder={sortOrder || defaultSortOrder}>
        {(props) => {
          if (props.replies) {
            const parsedReplies = props?.replies?.map(toForumCardModel) || [];
            return children({ loading: false, error: undefined, data: { ...props, replies: parsedReplies } });
          } else {
            return children({ loading: true });
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
    <ForumAnswerModel.Query id={forumQuestionId} page={page} limit={limit} sortOrder={answerSorts.newestSort}>
      {(props) => {
        if (props.replies) {
          const parsedReplies = props?.replies?.map(toForumCardModel) || [];
          return children({ loading: false, error: undefined, data: { ...props, replies: parsedReplies } });
        } else {
          return children({ loading: true });
        }
      }}
    </ForumAnswerModel.Query>
  );
};
export default ForumAnswersProvider;
