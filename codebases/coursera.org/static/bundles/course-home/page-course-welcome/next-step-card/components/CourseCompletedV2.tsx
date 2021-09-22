/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

import type { CourseCompletedNextStep } from 'bundles/course-home/page-course-welcome/next-step-card/types/NextStep';
import type { ReplaceCustomContent as ReplaceCustomContentType } from 'bundles/custom-labels/types/CustomLabels';
import CourseOptions from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/CourseOptions';

import CourseCompletedWithoutCertificate from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/CourseCompletedWithoutCertificate';
import CourseCompletedWithCertificate from 'bundles/course-home/page-course-welcome/next-step-card/components/course-complete/CourseCompletedWithCertificate';

type Props = {
  nextStep: CourseCompletedNextStep;
  replaceCustomContent: ReplaceCustomContentType;
};

const CourseCompletedV2: React.FC<Props> = (props) => {
  const {
    nextStep: {
      definition: {
        s12n,
        certificateMetadata,
        gradeMetadata,
        canViewCertificate,
        course,
        canUnenroll,
        canSwitchSession,
      },
    },
    replaceCustomContent,
  } = props;

  let courseCompletedComponent: React.ReactNode = null;

  if (canViewCertificate) {
    courseCompletedComponent = (
      <CourseCompletedWithCertificate
        certificateMetadata={certificateMetadata}
        gradeMetadata={gradeMetadata}
        s12n={s12n}
        replaceCustomContent={replaceCustomContent}
        partnerNames={course.partnerNames}
        courseName={course.name}
      />
    );
  } else {
    courseCompletedComponent = (
      <CourseCompletedWithoutCertificate gradeMetadata={gradeMetadata} replaceCustomContent={replaceCustomContent} />
    );
  }

  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <div
        css={css`
          position: absolute;
          right: 0;
        `}
      >
        <CourseOptions course={course} canUnenroll={canUnenroll} canSwitchSession={canSwitchSession} />
      </div>

      {courseCompletedComponent}
    </div>
  );
};

export default CourseCompletedV2;
