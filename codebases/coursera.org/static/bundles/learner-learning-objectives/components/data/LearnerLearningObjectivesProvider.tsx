import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import type { ApolloQueryResult } from 'apollo-client';

import type {
  OnDemandLearningObjectivesV2 as LearningObjective,
  OnDemandLearningObjectivesV2MultiGetQuery as Data,
  OnDemandLearningObjectivesV2MultiGetQueryVariables as Variables,
} from 'bundles/learner-learning-objectives/components/data/__generated__/OnDemandLearningObjectivesV2';

/* eslint-disable graphql/template-strings */
export const learnerLearningObjectivesProviderQuery = gql`
  query LearnerLearningObjectivesProviderQuery($ids: String!) {
    OnDemandLearningObjectivesV2 @naptime {
      multiGet(ids: $ids) {
        elements {
          id
          description
        }
      }
    }
  }
`;
/* eslint-enable graphql/template-strings */

export type { LearningObjective };

type OutputProps = {
  loading: boolean;
  learningObjectives?: Array<LearningObjective> | null;
  refetch: (variables?: Variables) => Promise<ApolloQueryResult<Data>>;
};

type InputProps = {
  learningObjectiveIds?: Array<string>;
  children: (props: OutputProps) => React.ReactElement<OutputProps>;
};

/**
 * This component is responsible for fetching Learning Objectives when provided with a list of learning objective ids.
 * While the query is fetching, loading will be true and learningObjectives will be undefined.
 * After the query finishes, loading will be false and learningObjectives may contain data if data was successfully found.
 *
 * Since this component is providing optional non-critical data, the component returns undefined for both lack of data and
 * API failures; because, the learner experience should not be blocked for "optional" features. As far as monitoring and
 * code health, the expectation is that serious 500 errors will be caught by BE endpoint monitoring and unexpected 400 errors
 * will be caught by e2e tests that assert that data was successfully rendered for expected scenarios.
 * */
const LearnerLearningObjectivesProvider: React.FC<InputProps> = ({ learningObjectiveIds, children }) => {
  return (
    <Query<Data, Variables>
      query={learnerLearningObjectivesProviderQuery}
      variables={{
        ids: learningObjectiveIds?.join(',') || '',
      }}
    >
      {({ loading, data, refetch }) => {
        const learningObjectives =
          learningObjectiveIds &&
          data?.OnDemandLearningObjectivesV2?.multiGet?.elements?.sort(
            (a, b) => learningObjectiveIds?.indexOf(a.id) - learningObjectiveIds?.indexOf(b.id)
          );
        return children({
          loading,
          learningObjectives,
          refetch,
        });
      }}
    </Query>
  );
};

export default LearnerLearningObjectivesProvider;
