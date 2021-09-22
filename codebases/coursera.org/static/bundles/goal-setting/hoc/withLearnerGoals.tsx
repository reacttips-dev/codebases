/* eslint-disable graphql/template-strings */
import React from 'react';

import gql from 'graphql-tag';

import { compose } from 'recompose';
import { graphql } from 'react-apollo';

import {
  LearnerGoalsV1,
  LearnerGoalsV1ByUserAndCourseBranchQuery,
  LearnerGoalsV1ByUserAndCourseBranchQueryVariables,
} from 'bundles/naptimejs/resources/__generated__/LearnerGoalsV1';

import user from 'js/lib/user';

export const LearnerGoalsQuery = gql`
  query GoalsQuery($userId: String!, $courseBranchId: String!) {
    LearnerGoalsV1 @naptime {
      byUserAndCourseBranch(userId: $userId, courseBranchId: $courseBranchId) {
        elements {
          goalType
          name
          id
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

type PropsFromCaller = {
  branchId: string;
};

type PropsToComponent = PropsFromCaller & {
  areLearnerGoalsLoading: boolean;
  learnerGoals: LearnerGoalsV1[];
};

export default <T extends PropsFromCaller>(PassedComponent: React.ComponentType<T & PropsToComponent>) =>
  compose<T & PropsToComponent, T>(
    graphql<
      PropsToComponent,
      LearnerGoalsV1ByUserAndCourseBranchQuery,
      LearnerGoalsV1ByUserAndCourseBranchQueryVariables,
      PropsFromCaller
    >(LearnerGoalsQuery, {
      options: ({ branchId: courseBranchId }) => ({
        variables: {
          courseBranchId,
          userId: user.get().id.toString(),
        },
        fetchPolicy: 'cache-and-network',
      }),
      props: ({ ownProps, data }) => {
        const areLearnerGoalsLoading = data?.loading || false;
        const learnerGoals = data?.LearnerGoalsV1?.byUserAndCourseBranch?.elements || [];

        // filter out other goals for v2
        const v2LearnerGoals = learnerGoals.filter((goal) => goal.goalType.typeName === 'GoalNDaysAWeek');

        return {
          ...ownProps,
          areLearnerGoalsLoading,
          learnerGoals: v2LearnerGoals,
        };
      },
    })
  )(PassedComponent);
