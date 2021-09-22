/*
  FullStory HOC component that implements gating logic for when to activate FullStory recording.
  For integration instructions, see:
  https://coursera.atlassian.net/wiki/spaces/EN/pages/194740229/FullStory+Integration
*/

import React from 'react';
import omit from 'lodash/omit';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import type { ApolloQueryResult } from 'apollo-client';

import user from 'js/lib/user';

import epicClient from 'bundles/epic/client';
import ComputedItem, { ComputedItemType } from 'bundles/ondemand/lib/ComputedItem';
import FullStory, { FullStoryProps } from 'bundles/common/components/FullStory';

type CourseIdToDegreeIds = {
  [courseId: string]: Array<string>;
};

/* eslint-disable graphql/template-strings */
export const degreeLearnerMembershipsQuery = gql`
  query DegreeLearnerMembershipsQuery($userId: String!) {
    DegreeLearnerMembershipsV1Resource {
      memberships: byUser(userId: $userId) {
        elements {
          id
          degreeId
          degree {
            id
            courseIds
          }
        }
      }
    }
  }
`;
/* eslint-enable graphql/template-strings */

type DegreeLearnerMembershipsQuery = {
  DegreeLearnerMembershipsV1Resource?: {
    memberships?: {
      elements?: {
        degreeId: string;
        degree: {
          courseIds: string[];
        };
      }[];
    };
  };
};

// TODO (jcheung) write unit test for DegreeLearnerMemberships
export const DegreeLearnerMemberships = ({
  userId,
  children,
}: {
  userId?: string;
  children: (x0: {
    loading: boolean;
    enrolledDegrees?: CourseIdToDegreeIds;
    refetch: () => Promise<ApolloQueryResult<{}>>;
  }) => React.ReactElement<{}>;
}) => {
  return (
    <Query<DegreeLearnerMembershipsQuery>
      query={degreeLearnerMembershipsQuery}
      variables={{ userId: userId || user.get().id.toString() }}
    >
      {({ loading, data, refetch }) => {
        const rawData = (((data || {}).DegreeLearnerMembershipsV1Resource || {}).memberships || {}).elements;

        const courseIdToDegreeIds = {} as CourseIdToDegreeIds;
        if (rawData) {
          rawData.forEach((degree) => {
            degree.degree.courseIds.forEach((courseId) => {
              if (courseIdToDegreeIds[courseId]) {
                courseIdToDegreeIds[courseId].push(degree.degreeId);
              } else {
                courseIdToDegreeIds[courseId] = [degree.degreeId];
              }
            });
          });
        }

        return children({
          loading,
          enrolledDegrees: rawData ? courseIdToDegreeIds : undefined,
          refetch,
        });
      }}
    </Query>
  );
};

export const isCourseFullStoryEnabled = (enrolledDegrees: CourseIdToDegreeIds, item: ComputedItemType) => {
  const associatedDegreeIds = enrolledDegrees[item.courseId];
  const { optedInDegreeIds = [] as string[], optedInCourseIds = [] as string[] } =
    epicClient.get('FullStory', 'fullCoverageConfig') || {};

  // current item is part of a degree course for learner
  if (associatedDegreeIds) {
    return (
      optedInDegreeIds.some((optedInDegreeId: string) => associatedDegreeIds.includes(optedInDegreeId)) ||
      optedInCourseIds.includes(item.courseId)
    );
  } else {
    // use EPIC system to achieve adjustable sampling rate
    return epicClient.get('FullStory', 'limitedCoverageEnabled');
  }
};

const CourseFullStory = (props: FullStoryProps) => (
  <DegreeLearnerMemberships>
    {({ enrolledDegrees }) => (
      <ComputedItem>
        {({ item }: { item: ComputedItemType }) => {
          if (enrolledDegrees && item) {
            if (isCourseFullStoryEnabled(enrolledDegrees, item)) {
              const propsWithDefaultData = {
                ...props,
                data: {
                  ...props.data,
                  courseId: item.courseId,
                  courseSlug: item.courseSlug,
                },
              };
              return <FullStory {...propsWithDefaultData} />;
            } else {
              return props.children();
            }
          } else {
            // TODO (jcheung) maybe render spinner while data loading?
            return null;
          }
        }}
      </ComputedItem>
    )}
  </DegreeLearnerMemberships>
);

export function withCourseFullStory<BaseProps extends {}>(
  BaseComponent: React.ComponentType<BaseProps>
): React.ComponentType<BaseProps & { fullStoryOptions: FullStoryProps }> {
  return (props) => {
    const { fullStoryOptions } = props;
    return (
      <CourseFullStory {...fullStoryOptions}>
        {() => <BaseComponent {...(omit(props, ['fullStoryOptions']) as BaseProps)} />}
      </CourseFullStory>
    );
  };
}

export default CourseFullStory;
