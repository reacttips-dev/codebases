import React from 'react';
import { ApolloError } from 'apollo-client';
import { Query } from 'react-apollo';
import { LearnerCourseScheduleSuggestionsQuery } from 'bundles/learner-progress/utils/queries';

type CourseScheduleSuggestionDataRenderProps = {
  loading: boolean;
  error?: ApolloError;
  data?: object;
};

type Props = {
  userCourseId: string;
  children: (renderProps: CourseScheduleSuggestionDataRenderProps) => React.ReactNode;
};

type Data = {
  LearnerCourseScheduleSuggestionsV1Resource: any;
};

type Variables = {
  id: string;
};

const CourseScheduleSuggestionDataProvider: React.FC<Props> = ({ userCourseId, children }) => (
  <Query<Data, Variables>
    query={LearnerCourseScheduleSuggestionsQuery}
    variables={{
      id: userCourseId,
    }}
  >
    {({ loading, error, data }: CourseScheduleSuggestionDataRenderProps) => children({ loading, error, data })}
  </Query>
);

export default CourseScheduleSuggestionDataProvider;
