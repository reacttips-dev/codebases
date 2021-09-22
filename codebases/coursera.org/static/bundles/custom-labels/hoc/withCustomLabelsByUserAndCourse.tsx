import React from 'react';
import user from 'js/lib/user';
import gql from 'graphql-tag';
import waitForGraphQL from 'js/lib/waitForGraphQL';

import { compose, withProps } from 'recompose';

import withCustomLabelsMapping from './withCustomLabelsMapping';

import { ReplaceCustomContent } from '../types/CustomLabels';
import {
  CustomLabelsV2,
  CustomLabelsV2ByUserAndCourseQuery,
  CustomLabelsV2ByUserAndCourseQueryVariables,
} from './__generated__/CustomLabelsV2';

type OuterProps = {
  courseId: string;
  loadingComponent?: React.ReactNode;
};

type UserProps = {
  userId: string;
};

type InnerProps = OuterProps &
  UserProps & {
    customLabelsV2?: CustomLabelsV2;
    replaceCustomContent: ReplaceCustomContent;
  };

/* eslint-disable graphql/template-strings */
const CustomLabelsQuery = gql`
  query CustomLabelsQuery($userId: String!, $courseId: String!) {
    CustomLabelsV2 @naptime {
      byUserAndCourse(userId: $userId, courseId: $courseId) {
        elements {
          id
          moduleNames
          isRhyme
          namings {
            courseraCourse
            courseraWeek
          }
        }
      }
    }
  }
`;
/* eslint-enable graphql/template-strings */

export default <PropsFromCaller extends OuterProps>(
  Component: React.ComponentType<PropsFromCaller & InnerProps>,
  loadingComponent?: React.ReactNode
) =>
  compose<InnerProps & PropsFromCaller, PropsFromCaller>(
    withProps<UserProps, PropsFromCaller>(() => ({
      userId: user.get().id.toString(),
    })),
    waitForGraphQL<
      PropsFromCaller & InnerProps,
      CustomLabelsV2ByUserAndCourseQuery,
      CustomLabelsV2ByUserAndCourseQueryVariables,
      InnerProps
    >(
      CustomLabelsQuery,
      {
        options: ({ courseId, userId }) => ({
          variables: {
            courseId,
            userId,
          },
        }),
        props: ({ data, ownProps }) => {
          const customLabelsV2 = data?.CustomLabelsV2?.byUserAndCourse?.elements?.[0];

          return {
            ...ownProps,
            customLabelsV2,
          };
        },
      },
      loadingComponent
    ),
    withCustomLabelsMapping
  )(Component);
