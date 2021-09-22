/* eslint-disable graphql/template-strings */
import React from 'react';

import gql from 'graphql-tag';

import { compose } from 'recompose';
import { graphql } from 'react-apollo';

import CMLUtils from 'bundles/cml/utils/CMLUtils';

const GoalChoicesQuery = gql`
  query GoalChoicesQuery($courseBranchId: String!) {
    GoalChoicesV1 @naptime {
      byCourseBranch(courseBranchId: $courseBranchId) {
        elements {
          id
          goalType
          name
          description
          isRecommended
          goalContextId
          progress {
            state
            percentage
            history
          }
        }
      }
    }
  }
`;

export default (PassedComponent: React.ComponentType<any>) =>
  compose(
    graphql(GoalChoicesQuery, {
      options: ({ branchId: courseBranchId }: { branchId: string }) => ({
        variables: {
          courseBranchId,
        },
        fetchPolicy: 'cache-and-network',
      }),
      props: ({ data, ownProps }: any) => {
        const areGoalChoicesLoading = data?.loading || false;

        return {
          ...ownProps,
          areGoalChoicesLoading,
          goalChoices: (data?.GoalChoicesV1?.byCourseBranch?.elements || []).map(
            ({ name, description, ...goalChoice }: $TSFixMe) => ({
              ...goalChoice,
              name: CMLUtils.create(name),
              description: CMLUtils.create(description),
            })
          ),
        };
      },
    })
  )(PassedComponent);
