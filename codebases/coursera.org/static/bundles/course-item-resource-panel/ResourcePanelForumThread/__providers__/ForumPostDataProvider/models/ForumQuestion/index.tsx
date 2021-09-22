import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { ApolloError } from 'apollo-client';
import SocialProfilesAPI from '../SocialProfiles';
import { ForumPostByIdQuery } from './__types__';
import { ForumPost, ForumQuestionsV1Resource } from '../../__types__';
import { tupleToStringKey } from '../../../../../../../js/lib/stringKeyTuple';
import { getURI } from '../../../../__helpers__/apiHelpers';
import { toForumPost } from './helpers/ForumQuestionV1ResponseToCardModel';

export const ForumPostByIdAPI = {
  params: {
    userId: 1,
    courseForumId: 'string',
    sessionFilter: 'string',
    shouldAggregate: true,
    includeDeleted: false,
    sort: 'string',
    creatorId: 2,
  },
  fields: [
    'content',
    'state',
    'creatorId',
    'createdAt',
    'forumId',
    'sessionId',
    'lastAnsweredBy',
    'lastAnsweredAt',
    'order',
    'upvoteCount',
    'followCount',
    'totalAnswerCount',
    'topLevelAnswerCount',
    'viewCount',
    'isFlagged',
    'isFollowing',
    'isUpvoted',
    'answerBadge',
    'forumAnswerBadgeTagMap',
  ],
  includes: {
    profiles: SocialProfilesAPI,
  },
} as ForumPostByIdQuery;

// eslint-disable graphql/template-strings
const ForumPostQuestionQueryV1 = gql`
  query ForumQuestionsQuery($forumQuestionItemId: String!, $urlQuery: String!) {
    ForumQuestionsV1Resource(forumQuestionItemId: $forumQuestionItemId, urlQuery: $urlQuery)
      @rest(
        type: "ForumQuestions"
        path: "onDemandCourseForumQuestions.v1/{args.forumQuestionItemId}?{args.urlQuery}"
        method: "GET"
      ) {
      elements @type(name: "ForumQuestions")
      linked
    }
  }
`;
// eslint-enable graphql/template-strings

export type DataProps = {
  loading: boolean;
  error?: ApolloError;
  data?: ForumQuestionsV1Resource;
};

const ForumQuestionModel = {
  api: 'onDemandCourseForumQuestions.v1',
  getURI: (args: ForumPostByIdQuery) => {
    return getURI<ForumPostByIdQuery>(args);
  },
  Query: ({
    userId,
    courseId,
    forumQuestionId,
    children,
  }: {
    userId: number;
    courseId: string;
    forumQuestionId: string;
    children: (props: DataProps) => JSX.Element | null;
  }) => {
    const courseForumId = tupleToStringKey([userId, courseId, forumQuestionId]);

    return (
      <Query<ForumQuestionsV1Resource, { forumQuestionItemId: string; urlQuery: string }>
        query={ForumPostQuestionQueryV1}
        variables={{
          forumQuestionItemId: courseForumId,
          urlQuery: getURI<ForumPostByIdQuery>({
            api: 'onDemandCourseForumQuestions.v1',
            params: {
              userId,
              courseForumId,
              shouldAggregate: true,
              includeDeleted: false,
            },
            fields: [
              'content',
              'state',
              'creatorId',
              'createdAt',
              'forumId',
              'sessionId',
              'lastAnsweredBy',
              'lastAnsweredAt',
              'order',
              'upvoteCount',
              'followCount',
              'totalAnswerCount',
              'topLevelAnswerCount',
              'viewCount',
              'isFlagged',
              'isFollowing',
              'isUpvoted',
              'answerBadge',
              'forumAnswerBadgeTagMap',
            ],
            includes: {
              profiles: {
                api: 'onDemandSocialProfiles.v1',
                params: [],
                fields: ['userId', 'externalUserId', 'fullName', 'photoUrl', 'courseRole'],
              },
              posts: {
                api: 'onDemandCourseForumAnswers.v1',
                fields: [
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
                ],
                includes: {
                  children: {
                    api: 'onDemandCourseForumAnswers.v1',
                    fields: [
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
                    ],
                  },
                },
              },
            },
          } as ForumPostByIdQuery),
        }}
      >
        {({ loading, error, data }) => {
          if (children && typeof children === 'function') {
            if (loading || error) return children({ loading, error });

            if (data) {
              return children({ loading: false, error, data });
            } else {
              return null;
            }
          }
          return null;
        }}
      </Query>
    );
  },
};

export const asForumPost = ({
  loading,
  data,
  error,
}: {
  loading: boolean;
  data: ForumQuestionsV1Resource;
  error: ApolloError;
}): { loading: boolean; data: ForumPost; error: ApolloError } => {
  return { loading, data: toForumPost(data), error };
};

export default ForumQuestionModel;
