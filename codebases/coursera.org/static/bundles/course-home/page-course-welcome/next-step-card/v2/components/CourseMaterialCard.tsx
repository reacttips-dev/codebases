/* @jsx jsx */
import React from 'react';

import { jsx, css } from '@emotion/react';

import user from 'js/lib/user';

import { CourseCard, Title } from 'bundles/course-home/page-course-welcome/next-step-card/v2/components/CourseCard';
import { CourseNextStepCourseMaterialNextStep } from 'bundles/naptimejs/resources/__generated__/GuidedCourseNextStepsV1';

import CourseMaterialNextUp from 'bundles/course-home/page-course-welcome/next-step-card/v2/components/CourseMaterialNextUp';

import _t from 'i18n!nls/course-home';
import waitForGraphQL from 'js/lib/waitForGraphQL';
import { courseGradesAndProgressesQuery } from 'bundles/course-home/page-course-welcome/queries';
import {
  GuidedCourseSessionProgressesV1,
  GuidedCourseSessionProgressesV1MultiGetQuery,
  GuidedCourseSessionProgressesV1MultiGetQueryVariables,
} from 'bundles/naptimejs/resources/__generated__/GuidedCourseSessionProgressesV1';

type InputProps = {
  courseSlug: string;
  courseId: string;
  courseNextStep: CourseNextStepCourseMaterialNextStep;
};

type Props = InputProps & {
  courseProgress: GuidedCourseSessionProgressesV1 | null;
};

const CourseMaterialCard: React.FunctionComponent<Props> = ({ courseProgress, courseId, courseNextStep }) => {
  const buttonText =
    courseNextStep.definition.item.computedProgressState === 'NotStarted' ? _t('Start') : _t('Continue');

  const href = courseNextStep.definition.item.resourcePath;

  const firstLecture = courseProgress?.weeks?.[0]?.modules?.[0]?.items.find(
    ({ contentSummary: { typeName } }) => typeName === 'lecture'
  );

  const isFirstLecture = firstLecture?.id === courseNextStep.definition.item.id;

  return (
    <CourseCard>
      <a
        css={css`
          width: 100%;
        `}
        href={href}
      >
        <Title>{isFirstLecture ? _t('Get started with your first video') : _t('Next Up')}</Title>
        <CourseMaterialNextUp
          buttonText={buttonText}
          buttonLink={href}
          courseId={courseId}
          courseNextStep={courseNextStep}
        />
      </a>
    </CourseCard>
  );
};

export default waitForGraphQL<
  Omit<Props, 'courseProgress'>,
  GuidedCourseSessionProgressesV1MultiGetQuery,
  GuidedCourseSessionProgressesV1MultiGetQueryVariables,
  Props
>(courseGradesAndProgressesQuery, {
  options: ({ courseSlug }) => ({
    variables: {
      ids: `${user.get().id}~${courseSlug}`,
    },
  }),
  props: ({ ownProps, data }) => ({
    ...ownProps,
    courseProgress: data?.GuidedCourseSessionProgressesV1?.multiGet?.elements?.[0] ?? null,
  }),
})(CourseMaterialCard);
