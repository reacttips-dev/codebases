import type React from 'react';
import gql from 'graphql-tag';

import type {
  LearnerCourseSchedulesV1GetQuery,
  LearnerCourseSchedulesV1GetQueryVariables,
} from 'bundles/naptimejs/resources/__generated__/LearnerCourseSchedulesV1';

import type {
  CoursesV1,
  CoursesV1SlugQuery,
  CoursesV1SlugQueryVariables,
} from 'bundles/naptimejs/resources/__generated__/CoursesV1';

import { compose, withProps } from 'recompose';

import waitFor from 'js/lib/waitFor';
import user from 'js/lib/user';
import waitForGraphQL from 'js/lib/waitForGraphQL';
import connectToRouter from 'js/lib/connectToRouter';

export default (PassedComponent: React.ComponentType<any>) =>
  compose(
    withProps((props) => ({
      ownProps: props,
    })),
    connectToRouter((router) => ({
      courseSlug: router.params.courseSlug,
    })),
    waitForGraphQL<{ courseSlug: string }, CoursesV1SlugQuery, CoursesV1SlugQueryVariables, {}>(
      gql`
        query CourseIdQuery($slug: String!) {
          CoursesV1 @naptime {
            slug(slug: $slug, showHidden: true) {
              elements {
                id
              }
            }
          }
        }
      `,
      {
        options: ({ courseSlug }) => ({
          variables: {
            slug: courseSlug,
          },
        }),
        props: ({ data }) => ({
          courseV1: data?.CoursesV1?.slug?.elements?.[0],
        }),
      }
    ),
    waitForGraphQL<
      { courseV1: CoursesV1 },
      LearnerCourseSchedulesV1GetQuery,
      LearnerCourseSchedulesV1GetQueryVariables,
      {}
    >(
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
        options: ({ courseV1 }) => ({
          variables: {
            id: `${user.get().id}~${courseV1?.id}`,
          },
        }),
        props: ({ data }) => {
          const learnerCourseSchedule = data?.LearnerCourseSchedulesV1?.get?.elements?.[0];

          if (learnerCourseSchedule) {
            return {
              branchId: learnerCourseSchedule?.computationMetadata?.branchId,
            };
          }

          return {
            branchId: null,
          };
        },
      }
    ),
    waitFor(({ branchId }) => !!branchId)
  )(PassedComponent);
