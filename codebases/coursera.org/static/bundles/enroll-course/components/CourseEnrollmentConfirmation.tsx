import React from 'react';
import gql from 'graphql-tag';
import path from 'js/lib/path';
import user from 'js/lib/user';

import { compose } from 'recompose';
import { isProjectLandingEnabled, isWeekLandingEnabled } from 'bundles/enroll-course/utils/featureGates';

import type {
  CoursesV1GetQuery,
  CoursesV1GetQueryVariables,
  CoursesV1,
} from 'bundles/naptimejs/resources/__generated__/CoursesV1';

import type {
  GuidedCourseWeekCardsV1MultiGetQueryVariables,
  GuidedCourseWeekCardsV1MultiGetQuery,
  GuidedCourseWeekCardsV1,
} from 'bundles/naptimejs/resources/__generated__/GuidedCourseWeekCardsV1';

import waitForGraphQL from 'js/lib/waitForGraphQL';

import _t from 'i18n!nls/enroll-course';

import 'css!./__styles__/CourseEnrollmentConfirmation';

type InputProps = {
  children?: React.ReactChildren;
  courseId: string;
};

type Props = InputProps & {
  course?: CoursesV1;
  courseWeekCards?: GuidedCourseWeekCardsV1;
};

const CourseEnrollmentConfirmation: React.FC<Props> = ({ courseId, children, course, courseWeekCards }) => {
  if (!course) {
    return null;
  }

  const projectItem = courseWeekCards?.weeks?.[0]?.modules?.[0]?.items?.find(
    ({ contentSummary: { typeName } }) => typeName === 'ungradedLti'
  );

  const isPreEnroll = course.courseStatus === 'preenroll';
  const isOnDemand = course.courseType === 'v2.ondemand' || course.courseType === 'v2.capstone';
  const link = path.join('/', 'learn', course.slug);
  const phoenixHomeLink = path.join(link, 'home', 'welcome');
  const homeLink = isOnDemand ? phoenixHomeLink : link;

  let cta = isPreEnroll ? link : homeLink;

  if (isWeekLandingEnabled(courseId)) {
    cta = isOnDemand && !isPreEnroll ? path.join(link, 'home', 'week', '1') : path.join(link, 'home');
  }

  if (isProjectLandingEnabled(courseId) && projectItem?.resourcePath) {
    cta = projectItem.resourcePath;
  }

  return (
    <div className="rc-CourseEnrollmentConfirmation">
      {children || false}

      <div className="headline-1-text align-horizontal-center welcome-message">
        {isPreEnroll
          ? _t(`Welcome to the course. The course will start ${course.plannedLaunchDate}.`)
          : _t('Welcome to the course. You can now access the course materials.')}
        <br />
      </div>

      <br />

      <div className="align-horizontal-center">
        <a href={cta} className="styleguide nostyle start-learning-button-link">
          {/* eslint-disable react/button-has-type */}
          <button className="primary align-horizontal-center cozy">
            {isPreEnroll ? _t('Continue') : _t('Start Learning')}
          </button>
          {/* eslint-enable react/button-has-type */}
        </a>
      </div>
    </div>
  );
};

export default compose<Props, InputProps>(
  waitForGraphQL<InputProps, CoursesV1GetQuery, CoursesV1GetQueryVariables, Omit<Props, 'courseMaterials'>>(
    gql`
      query CourseEnrolledQuery($id: String!) {
        CoursesV1 @naptime {
          get(id: $id, showHidden: true) {
            elements {
              name
              slug
              courseType
              plannedLaunchDate
            }
          }
        }
      }
    `,
    {
      options: ({ courseId }) => ({
        variables: {
          id: courseId,
        },
      }),
      props: ({ ownProps, data }) => ({
        ...ownProps,
        course: data?.CoursesV1?.get?.elements?.[0],
      }),
    }
  ),
  waitForGraphQL<
    Omit<Props, 'courseWeekCards'>,
    GuidedCourseWeekCardsV1MultiGetQuery,
    GuidedCourseWeekCardsV1MultiGetQueryVariables,
    Props
  >(
    gql`
      query courseWeekCards($ids: String!) {
        GuidedCourseWeekCardsV1 @naptime {
          multiGet(ids: $ids) {
            elements {
              id
              weeks
            }
          }
        }
      }
    `,
    {
      options: ({ course }) => ({
        variables: {
          ids: `${user.get().id}~${course?.slug}`,
        },
        errorPolicy: 'all',
      }),
      props: ({ ownProps, data }) => ({
        ...ownProps,
        courseWeekCards: data?.GuidedCourseWeekCardsV1?.multiGet?.elements?.[0],
      }),
    }
  )
)(CourseEnrollmentConfirmation);
