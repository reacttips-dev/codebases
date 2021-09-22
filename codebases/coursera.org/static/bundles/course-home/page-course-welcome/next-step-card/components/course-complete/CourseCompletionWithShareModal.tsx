import React from 'react';
import type { CourseCompletedNextStep } from 'bundles/course-home/page-course-welcome/next-step-card/types/NextStep';
import ViewOrShareCourseCompletion from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/variants/ViewOrShareCourseCompletion';
import ViewAndShareCourseCompletion from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/variants/ViewAndShareCourseCompletion';
import DefaultCourseCompletion from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/variants/DefaultCourseCompletion';

import 'css!bundles/course-home/page-course-welcome/next-step-card/components/__styles__/CourseCompleted';

import epic from 'bundles/epic/client';

type Props = {
  nextStep: CourseCompletedNextStep;
};

const CourseCompletionWithShareModal: React.SFC<Props> = (props) => {
  const {
    nextStep: {
      definition: {
        course,
        enrolledCourseIds,
        canViewCertificate,
        canUpgrade,
        canCompleteVerificationProfile,
        canSubscribe,
      },
    },
  } = props;

  const SHARE_CERTIFICATE_VARIANTS = {
    viewOrShare: 'ViewOrShare',
    viewAndShare: 'ViewAndShare',
  };

  const variant = epic.get('GrowthAcquisition', 'shareCertificateOnCompletion');

  switch (variant) {
    case SHARE_CERTIFICATE_VARIANTS.viewOrShare:
      return <ViewOrShareCourseCompletion course={course} enrolledCourseIds={enrolledCourseIds} />;
    case SHARE_CERTIFICATE_VARIANTS.viewAndShare:
      return <ViewAndShareCourseCompletion course={course} enrolledCourseIds={enrolledCourseIds} />;
    /* this is the default option when neither share option is shown, and what is currently shown 
      on course completion */
    default:
      return (
        <DefaultCourseCompletion
          canUpgrade={canUpgrade}
          canCompleteVerificationProfile={canCompleteVerificationProfile}
          canSubscribe={canSubscribe}
          canViewCertificate={canViewCertificate}
          course={course}
          enrolledCourseIds={enrolledCourseIds}
        />
      );
  }
};

export default CourseCompletionWithShareModal;
