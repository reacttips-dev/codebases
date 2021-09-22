import React from 'react';

import { GuidedCourseNextStepsV1 } from 'bundles/naptimejs/resources/__generated__/GuidedCourseNextStepsV1';
import { NextStep } from 'bundles/course-home/page-course-welcome/next-step-card/types/NextStep';

import CourseMaterialCard from 'bundles/course-home/page-course-welcome/next-step-card/v2/components/CourseMaterialCard';
import CourseResetDeadlinesCard from 'bundles/course-home/page-course-welcome/next-step-card/v2/components/CourseResetDeadlinesCard';
import CourseSwitchSessionCard from 'bundles/course-home/page-course-welcome/next-step-card/v2/components/CourseSwitchSessionCard';
import CourseNextStepLegacy from 'bundles/course-home/page-course-welcome/next-step-card/components/CourseNextStep';

type Props = {
  courseSlug: string;
  courseId: string;
  courseNextStep: GuidedCourseNextStepsV1;
};

export const CourseNextStep: React.FC<Props> = ({ courseId, courseSlug, courseNextStep }) => {
  const nextStep = courseNextStep?.nextStep;

  switch (nextStep?.typeName) {
    case 'courseMaterialNextStep':
      return <CourseMaterialCard courseId={courseId} courseNextStep={nextStep} courseSlug={courseSlug} />;
    case 'courseScheduleAdjustmentNextStep':
      return <CourseResetDeadlinesCard courseScheduleAdjustment={nextStep} courseId={courseId} />;
    case 'multipleDeadlinesNextStep':
    case 'sessionEndedNextStep':
    case 'notEnoughPeerReviewsNextStep':
      return <CourseSwitchSessionCard courseId={courseId} courseNextStep={nextStep} />;
    default:
      // Due to incompatibilities between the generated Naptime types and the custom local types,
      // we need to cast the next step to 'unknown' before casting it to the local type
      return nextStep ? (
        <CourseNextStepLegacy nextStep={(nextStep as unknown) as NextStep} courseId={courseId} />
      ) : null;
  }
};

export default CourseNextStep;
