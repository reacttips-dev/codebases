import React from 'react';
import gql from 'graphql-tag';

import { Query, QueryResult } from 'react-apollo';

import {
  CourseScheduleExperienceConfigurationV1GetQuery,
  CourseScheduleExperienceConfigurationV1GetQueryVariables,
  CourseScheduleExperienceConfigurationV1,
} from 'bundles/naptimejs/resources/__generated__/CourseScheduleExperienceConfigurationV1';

type Props = {
  courseBranchId: string;
  children: (
    renderProps: Pick<
      QueryResult<CourseScheduleExperienceConfigurationV1 | undefined, { courseBranchId: string }>,
      'loading' | 'error' | 'data'
    >
  ) => React.ReactNode;
};

/* eslint-disable graphql/template-strings */
export const CourseScheduleExperienceConfigurationQuery = gql`
  query CourseScheduleExperienceConfigurationV1Query($id: String!) {
    CourseScheduleExperienceConfigurationV1 @naptime {
      get(id: $id) {
        elements {
          id
          experienceType
        }
      }
    }
  }
`;

// Wrapping the base query so we can have a different return type
const CourseScheduleExperienceConfigurationQueryProvider: React.FC<Props> = ({ courseBranchId, children }) => (
  <Query<CourseScheduleExperienceConfigurationV1GetQuery, CourseScheduleExperienceConfigurationV1GetQueryVariables>
    query={CourseScheduleExperienceConfigurationQuery}
    variables={{
      id: courseBranchId,
    }}
  >
    {({ loading, error, data }) =>
      children({
        loading,
        error,
        data: data?.CourseScheduleExperienceConfigurationV1?.get?.elements?.[0],
      })
    }
  </Query>
);

export default CourseScheduleExperienceConfigurationQueryProvider;
