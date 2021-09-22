import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import user from 'js/lib/user';

/* eslint-disable graphql/template-strings */
export const proctoredAssessmentActionsQuery = gql`
  query ProctoredAssessmentActionsQuery(
    $submittedId: String!
    $standardProctorConfigurationId: String!
    $body: String!
  ) {
    ProctoredAssessmentActionsV1(
      submittedId: $submittedId
      standardProctorConfigurationId: $standardProctorConfigurationId
      body: $body
    )
      @rest(
        type: "ProctoredAssessmentActionsV1Data"
        path: "proctoredAssessmentActions.v1/?action=getProctoredAssessmentSummary&submitterId={args.submittedId}&standardProctorConfigurationId={args.standardProctorConfigurationId}"
        method: "POST"
        bodyKey: "body"
      ) {
      completedAttempts
      latestAttempt
      nextAttemptConfig
      remainingAttempts
      secondsLeftInLatestAttempt
      serverTimestamp
    }
  }
`;

/* eslint-enable graphql/template-strings */

export const ProctoredAssessmentActions = ({
  standardProctorConfigurationId,
  fetchPolicy = 'network-only',
  children,
}: {
  standardProctorConfigurationId?: string;
  fetchPolicy?: 'network-only' | 'cache-first';
  children: (x0: {
    loading: boolean;
    timeLimit?: number;
    remainingAttempts?: number;
    completedAttempts?: number;
    secondsLeftInLatestAttempt?: number;
    shouldShowTimer?: boolean;
    client: any;
    refetch: () => Promise<any>;
  }) => JSX.Element;
}) => {
  return (
    <Query
      query={proctoredAssessmentActionsQuery}
      variables={{
        submittedId: `user~${user.get().id}`,
        standardProctorConfigurationId,
        body: {},
      }}
      skip={!standardProctorConfigurationId}
      fetchPolicy={fetchPolicy}
    >
      {({ loading, data, refetch, client }: $TSFixMe) => {
        if (loading) {
          return children({ loading, refetch, client });
        }
        const { secondsLeftInLatestAttempt, nextAttemptConfig, latestAttempt, remainingAttempts, completedAttempts } =
          (data || {}).ProctoredAssessmentActionsV1 || {};

        const shouldShowTimer =
          ((latestAttempt || {}).hasUnsubmittedWork || (latestAttempt || {}).canContinueToWork) &&
          typeof ((nextAttemptConfig || {}).timeLimit || {}).duration === 'number';

        return children({
          loading: false,
          refetch,
          secondsLeftInLatestAttempt,
          remainingAttempts,
          completedAttempts,
          timeLimit: ((nextAttemptConfig || {}).timeLimit || {}).duration,
          shouldShowTimer,
          client,
        });
      }}
    </Query>
  );
};

export default ProctoredAssessmentActions;
