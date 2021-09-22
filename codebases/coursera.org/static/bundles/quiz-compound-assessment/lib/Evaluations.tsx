import React from 'react';
import ApolloClient, { FetchPolicy, ApolloQueryResult } from 'apollo-client';

import gql from 'graphql-tag';

import { Query } from 'react-apollo';

/* eslint-disable graphql/template-strings */
export const evaluationsQuery = gql`
  query evaluationsQuery($itemId: String!, $userId: Int!, $slug: String!, $body: String!) {
    evaluationsQuery(body: $body, itemId: $itemId, userId: $userId, slug: $slug)
      @rest(
        type: "RestEvaluations"
        path: "opencourse.v1/user/{args.userId}/course/{args.slug}/item/{args.itemId}/quiz/evaluations"
        method: "POST"
        bodyKey: "body"
      ) {
      contentResponseBody @type(name: "RestPracticeQuizQuestionDataResponseBody")
    }
  }
`;

/* eslint-enable graphql/template-strings */

type Evaluation = {
  score: number;
  maxScore: number;
  isPassed: boolean;
  passingPercent: number;
};

type Props = {
  slug: string;
  itemId: string;
  fetchPolicy?: FetchPolicy;
  userId: number;
  children: (x0: {
    lastSessionId?: string;
    unsubmittedSessionId?: string;
    loading: boolean;
    bestSessionId?: string;
    bestEvaluation?: Evaluation;
    lastEvaluation?: Evaluation;
    refetch?: () => Promise<ApolloQueryResult<{}>>;
    client?: ApolloClient<{}>;
  }) => React.ReactNode;
};

export const Evaluations = ({ slug, userId, itemId, children }: Props) => {
  const quizSessionVariables = {
    slug,
    itemId,
    userId,
  };

  const evaluationQueryBodyPayload = {
    contentRequestBody: {},
  };

  return (
    <Query
      query={evaluationsQuery}
      variables={{ ...quizSessionVariables, body: evaluationQueryBodyPayload }}
      fetchPolicy="network-only"
    >
      {({ loading, data, refetch, client }: $TSFixMe) => {
        if (loading) {
          return children({ loading });
        }

        const { bestEvaluation, bestSessionId, lastEvaluation, lastSessionId, unsubmittedSessionId } =
          data?.evaluationsQuery?.contentResponseBody || {};

        return children({
          loading: false,
          bestSessionId,
          bestEvaluation,
          lastEvaluation,
          lastSessionId,
          unsubmittedSessionId,
          refetch,
          client,
        });
      }}
    </Query>
  );
};

export default Evaluations;
