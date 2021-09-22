import React from 'react';
import { ApolloError } from 'apollo-client';
import { Query } from 'react-apollo';

import user from 'js/lib/user';

import { LearnerCourseScheduleRunningAndUpcomingQuery } from 'bundles/learner-progress/utils/queries';

type CourseScheduleRunningAndUpcomingDataRenderProps = {
  loading: boolean;
  error?: ApolloError;
  data?: object;
};

type Props = {
  courseId: string;
  children: (renderProps: CourseScheduleRunningAndUpcomingDataRenderProps) => React.ReactNode;
};

type Data = {
  LearnerCourseScheduleSuggestionsV1Resource: any;
};

type Variables = {
  id: string;
  userId: string;
};

const CourseScheduleRunningAndUpcomingDataProvider: React.FC<Props> = ({ courseId, children }) => (
  <Query<Data, Variables>
    query={LearnerCourseScheduleRunningAndUpcomingQuery}
    variables={{
      id: courseId,
      userId: user.get().id.toString(),
    }}
  >
    {({ loading, error, data }: CourseScheduleRunningAndUpcomingDataRenderProps) => children({ loading, error, data })}
  </Query>
);

export default CourseScheduleRunningAndUpcomingDataProvider;
