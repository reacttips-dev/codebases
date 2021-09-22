/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { Fragment } from 'react';

import { compose } from 'recompose';

import withCustomLabelsByUserAndCourse from 'bundles/custom-labels/hoc/withCustomLabelsByUserAndCourse';
import type { ReplaceCustomContent as ReplaceCustomContentType } from 'bundles/custom-labels/types/CustomLabels';
import SessionEnded from 'bundles/course-home/page-course-welcome/next-step-card/components/SessionEnded';
import CourseMaterial from 'bundles/course-home/page-course-welcome/next-step-card/components/CourseMaterial';
import CourseCompleted from 'bundles/course-home/page-course-welcome/next-step-card/components/CourseCompleted';
import CourseCompletedV2 from 'bundles/course-home/page-course-welcome/next-step-card/components/CourseCompletedV2';
import CourseRecommended from 'bundles/course-home/page-course-welcome/next-step-card/components/CourseRecommended';
import MultipleDeadlines from 'bundles/course-home/page-course-welcome/next-step-card/components/MultipleDeadlines';
import NotEnoughPeerReviews from 'bundles/course-home/page-course-welcome/next-step-card/components/NotEnoughPeerReviews';
import SessionJoinModal from 'bundles/course-sessions/components/SessionJoinModal';
import withEnrollmentStateBannerEnabledState from 'bundles/preview/containers/withEnrollmentStateBannerEnabledState';
import NoEnrollableSessions from 'bundles/course-home/page-course-welcome/next-step-card/components/NoEnrollableSessions';
import isDeprecatedNextStep from 'bundles/course-home/page-course-welcome/next-step-card/utils/isDeprecatedNextStep';
import { areCourseCompletedHomeVariantEnabled } from 'bundles/course-home/page-course-welcome/utils/featureGates';
import CompletedCourseRating from 'bundles/course-home/page-course-welcome/next-step-card/components/CompletedCourseRating';

import type { NextStep } from 'bundles/course-home/page-course-welcome/next-step-card/types/NextStep';

import 'css!./__styles__/CourseNextStep';

type OuterProps = {
  nextStep: NextStep;
  courseId: string;
};

type Props = OuterProps & {
  isEnrollmentStateBannerEnabled: boolean;
  replaceCustomContent: ReplaceCustomContentType;
};

const CourseNextStep: React.SFC<Props> = (props) => {
  const { nextStep, isEnrollmentStateBannerEnabled, courseId, replaceCustomContent } = props;

  let typeComponent: JSX.Element | null = null;
  if (isDeprecatedNextStep(nextStep?.typeName)) {
    return null;
  }
  if (nextStep.typeName === 'notEnoughPeerReviewsNextStep') {
    typeComponent = <NotEnoughPeerReviews nextStep={nextStep} />;
  } else if (nextStep.typeName === 'multipleDeadlinesNextStep') {
    typeComponent = <MultipleDeadlines nextStep={nextStep} />;
  } else if (nextStep.typeName === 'sessionEndedNextStep') {
    typeComponent = <SessionEnded nextStep={nextStep} />;
  } else if (nextStep.typeName === 'courseMaterialNextStep') {
    typeComponent = <CourseMaterial nextStep={nextStep} courseId={courseId} />;
  } else if (nextStep.typeName === 'courseCompletedNextStep') {
    return (
      <Fragment>
        {areCourseCompletedHomeVariantEnabled() ? (
          <Fragment>
            <div className="rc-CourseNextStepV2 card-no-action roomy">
              <CourseCompletedV2 nextStep={nextStep} replaceCustomContent={replaceCustomContent} />
            </div>
            <div className="course-Completed">
              <CompletedCourseRating courseId={courseId} courseSlug={nextStep.definition.course.slug} />
            </div>
            <div className="rc-CourseNextStepV2 card-no-action course-Completed">
              <CourseRecommended nextStep={nextStep} replaceCustomContent={replaceCustomContent} />
            </div>
          </Fragment>
        ) : (
          <div className="rc-CourseNextStepV2 card-no-action comfy">
            <CourseCompleted nextStep={nextStep} />
          </div>
        )}
      </Fragment>
    );

    // @ts-expect-error TSMIGRATION
  } else if (nextStep.typeName === 'noActiveSessionNextStep') {
    if (!isEnrollmentStateBannerEnabled) {
      // Course staff that see the enrollment state banner should NOT be forced to enroll in a session.
      // @ts-expect-error TSMIGRATION
      typeComponent = <SessionJoinModal allowClose={false} courseId={nextStep.definition.courseId} />;
    }
  } else if (nextStep.typeName === 'noEnrollableSessionsNextStep') {
    if (!isEnrollmentStateBannerEnabled) {
      // Course staff that see the enrollment state banner do not need to be enrolled in a session.
      typeComponent = <NoEnrollableSessions courseId={courseId} />;
    }
  }

  if (!typeComponent) {
    return null;
  }

  return <div className="rc-CourseNextStep card-no-action roomy">{typeComponent}</div>;
};

export default compose<Props, OuterProps>(
  withEnrollmentStateBannerEnabledState(),
  withCustomLabelsByUserAndCourse
)(CourseNextStep);
