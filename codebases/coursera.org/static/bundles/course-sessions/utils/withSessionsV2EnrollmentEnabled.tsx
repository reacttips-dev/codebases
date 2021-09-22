import React from 'react';
import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';

import user from 'js/lib/user';
import waitForGraphQL from 'js/lib/waitForGraphQL';
import gql from 'graphql-tag';

import CourseScheduleExperienceConfigurationQueryProvider from 'bundles/course-sessions/components/CourseScheduleExperienceConfigurationQueryProvider';

import type {
  LearnerCourseSchedulesV1GetQuery,
  LearnerCourseSchedulesV1GetQueryVariables,
} from 'bundles/naptimejs/resources/__generated__/LearnerCourseSchedulesV1';

type InputProps = Record<string, any>;

const withSessionsV2EnrollmentEnabled = (
  getCourseIdFromProps: (props: InputProps) => string,
  loadingComponent?: React.ReactNode | React.FC
) => (BaseComponent: React.ComponentType<any>) => {
  const componentName = BaseComponent.displayName || BaseComponent.name;

  type Props = InputProps & {
    branchId: string;
  };

  const HOC: React.FC<Props> = ({ branchId, ...props }) => (
    <CourseScheduleExperienceConfigurationQueryProvider courseBranchId={branchId}>
      {({ error, data, loading }) => {
        if (error) {
          return null;
        }

        if (loading && loadingComponent) {
          if (typeof loadingComponent === 'function') {
            return loadingComponent(props);
          } else {
            return loadingComponent;
          }
        }

        const sessionsV2EnrollmentEnabled = data?.experienceType.typeName == 'alwaysAvailable';

        return <BaseComponent sessionsV2EnrollmentEnabled={sessionsV2EnrollmentEnabled} {...props} />;
      }}
    </CourseScheduleExperienceConfigurationQueryProvider>
  );

  HOC.displayName = `withSessionsV2EnrollmentEnabled(${componentName})`;

  hoistNonReactStatics(HOC, BaseComponent);

  return waitForGraphQL<InputProps, LearnerCourseSchedulesV1GetQuery, LearnerCourseSchedulesV1GetQueryVariables, Props>(
    gql`
      query LearnerCourseSchedulesBranchIdQuery($id: String!) {
        LearnerCourseSchedulesV1 @naptime {
          get(id: $id) {
            elements {
              id
              computationMetadata {
                branchId
              }
            }
          }
        }
      }
    `,
    {
      options: (props) => ({
        variables: {
          id: `${user.get().id}~${getCourseIdFromProps(props)}`,
        },
      }),
      props: ({ ownProps, data }) => ({
        branchId:
          data?.LearnerCourseSchedulesV1?.get?.elements?.[0]?.computationMetadata.branchId ??
          getCourseIdFromProps(ownProps),
      }),
    },
    loadingComponent
  )(HOC);
};

export default withSessionsV2EnrollmentEnabled;
