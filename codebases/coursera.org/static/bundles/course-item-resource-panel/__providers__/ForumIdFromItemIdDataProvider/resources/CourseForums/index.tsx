import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import React from 'react';
import { ApolloError } from 'apollo-client';
import { filterByItemId } from 'bundles/course-item-resource-panel/__providers__/ForumIdFromItemIdDataProvider/__helpers__/filter_by_item_id';
import { CourseForum, CourseForumsQuery, CourseForumsV1Response } from './__types__';
import { getURI } from '../../__helpers__/apiHelpers';

const CourseForumsAPI = ({
  api: 'onDemandCourseForums.v1',
  params: ['q', 'itemId', 'courseId'],
  fields: ['forumType', 'forumId'],
} as unknown) as CourseForumsQuery;

// eslint-disable graphql/template-strings
const CourseForumsQueryV1 = gql`
  query CourseForumsQueryV1($urlQuery: String!) {
    CourseForumsV1(urlQuery: $urlQuery)
      @rest(type: "CourseForums", path: "onDemandCourseForums.v1/?{args.urlQuery}", method: "GET") {
      elements @type(name: "CourseForums")
    }
  }
`;
// eslint-enable graphql/template-strings

export type DataProps = {
  loading: boolean;
  error?: ApolloError;
  data?: CourseForum[];
};

type CourseForumsV1QueryVariables = { urlQuery: string };

function parseResponse(data: CourseForumsV1Response) {
  const { CourseForumsV1 } = data;
  const { elements } = CourseForumsV1;
  return elements;
}

export const parseUri = (args: CourseForumsQuery) => getURI<CourseForumsQuery>(args);

export const QueryByItemId = ({
  id,
  itemId,
  children,
}: {
  id: string;
  itemId: string;
  children: (props: DataProps) => JSX.Element | null;
}) => {
  return (
    <Query<CourseForumsV1Response, CourseForumsV1QueryVariables>
      query={CourseForumsQueryV1}
      variables={{
        urlQuery: getURI<CourseForumsQuery>({
          api: CourseForumsAPI.api,
          params: {
            q: 'course',
            courseId: id,
          },
          fields: ['forumType', 'forumId'],
        }),
      }}
    >
      {({ loading, error, data }) => {
        if (children && typeof children === 'function') {
          if (loading || error) return children({ loading, error });

          if (data) {
            return children({ loading: false, error, data: filterByItemId(parseResponse(data), itemId) });
          } else {
            return null;
          }
        }
        return null;
      }}
    </Query>
  );
};

export default CourseForumsAPI;
