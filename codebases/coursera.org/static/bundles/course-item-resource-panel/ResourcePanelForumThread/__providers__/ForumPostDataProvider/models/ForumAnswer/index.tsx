import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import React from 'react';
import type { ApolloError } from 'apollo-client';
import { getURI } from '../../../../__helpers__/apiHelpers';
import type { ForumAnswersV1Response, ForumPostAnswerQuery } from './__types__';

const AnswersAPI = {
  api: 'onDemandCourseForumAnswers.v1',
  params: ['userId', 'courseForumId', 'sessionFilter', 'shouldAggregate', 'includeDeleted', 'sort', 'creatorId'],
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
};

const ForumPostAnswerQueryV1 = gql`
  query ForumAnswersQuery($forumAnswerItemId: String!, $urlQuery: String!) {
    ForumAnswersV1(forumAnswerItemId: $forumAnswerItemId, urlQuery: $urlQuery)
      @rest(type: "ForumQuestions", path: "onDemandCourseForumAnswers.v1/?{args.urlQuery}", method: "GET") {
      elements @type(name: "ForumAnswers")
      linked
    }
  }
`;

export type DataProps = {
  loading: boolean;
  error?: ApolloError;
  data?: ForumAnswersV1Response;
};

type ForumAnswersV1QueryVariables = { forumAnswerItemId: string; urlQuery: string };

const AnswersModel = {
  ...AnswersAPI,
  get: (args: ForumPostAnswerQuery) => {
    return getURI<ForumPostAnswerQuery>(args);
  },
  QueryById: ({
    id,
    children,
    page,
    limit,
  }: {
    id: string;
    children: (props: DataProps) => JSX.Element | null;
    page: number;
    limit: number;
  }) => {
    return (
      <Query<ForumAnswersV1Response, ForumAnswersV1QueryVariables>
        query={gql`
          query ForumAnswersQueryById($forumAnswerItemId: String!, $urlQuery: String!) {
            ForumAnswersV1(forumAnswerItemId: $forumAnswerItemId, urlQuery: $urlQuery)
              @rest(
                type: "ForumQuestions"
                path: "onDemandCourseForumAnswers.v1/{args.forumAnswerItemId}?{args.urlQuery}"
                method: "GET"
              ) {
              elements @type(name: "ForumAnswers")
              linked
            }
          }
        `}
        variables={{
          forumAnswerItemId: id,
          urlQuery: getURI<ForumPostAnswerQuery>({
            api: AnswersAPI.api,
            path: '',
            params: {
              q: 'byParentForumAnswerId',
              start: page ? page * limit : 0,
              limit,
              userCourseForumAnswerId: id,
              shouldAggregate: true,
              includeDeleted: false,
            },
            fields: [
              'content',
              'childAnswerCount',
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
            },
          } as ForumPostAnswerQuery),
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
  Query: ({
    id,
    children,
    page,
    limit,
  }: {
    id: string;
    children: (props: DataProps) => JSX.Element | null;
    page: number;
    limit: number;
  }) => {
    return (
      <Query<ForumAnswersV1Response, ForumAnswersV1QueryVariables>
        query={ForumPostAnswerQueryV1}
        variables={{
          forumAnswerItemId: id,
          urlQuery: getURI<ForumPostAnswerQuery>({
            api: AnswersAPI.api,
            path: '',
            params: {
              q: 'byForumQuestionId',
              start: page ? page * limit : 0,
              limit,
              userCourseQuestionId: id,
              shouldAggregate: true,
              includeDeleted: false,
            },
            fields: [
              'content',
              'childAnswerCount',
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
            },
          } as ForumPostAnswerQuery),
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

export default AnswersModel;
