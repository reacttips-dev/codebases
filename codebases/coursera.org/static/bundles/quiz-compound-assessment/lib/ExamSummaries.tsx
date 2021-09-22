import React from 'react';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

/* eslint-disable graphql/template-strings */
export const examSummariesQuery = gql`
  query ExamSummariesQuery($id: String!) {
    OnDemandExamSummariesV1 @naptime {
      get(id: $id) {
        elements {
          id
          lockingConfigurationSummary
          bestEvaluation
          lastEvaluation
          lastSessionId
          unsubmittedSessionId
          nudge
        }
      }
    }
  }
`;

/* eslint-enable graphql/template-strings */

type Props = {
  courseId: string;
  itemId: string;
  children: (x0: {
    lastSessionId?: string;
    nudge?: {
      nudgeType: string;
      nudgeNumber: number;
    };
    unsubmittedSessionId?: string;
    bestEvaluation?: {
      score: number;
      maxScore: number;
      passingFraction: number;
    };
    loading: boolean;
    lockingConfigurationSummary?: any;
    refetch?: () => Promise<any>;
  }) => React.ReactNode;
};

export const ExamSummaries = ({ courseId, itemId, children }: Props) => {
  return (
    <Query query={examSummariesQuery} variables={{ id: `${courseId}~${itemId}` }}>
      {({ loading, data, refetch }: $TSFixMe) => {
        if (loading || !data) {
          return children({ loading });
        }
        const {
          lastSessionId,
          lockingConfigurationSummary,
          unsubmittedSessionId,
          bestEvaluation,
          nudge,
        } = data.OnDemandExamSummariesV1.get.elements[0];

        return children({
          loading: false,
          lastSessionId,
          lockingConfigurationSummary,
          unsubmittedSessionId,
          bestEvaluation,
          nudge,
          refetch,
        });
      }}
    </Query>
  );
};

export default ExamSummaries;
