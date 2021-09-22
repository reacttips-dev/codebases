/* @jsx jsx */
import React from 'react';
import gql from 'graphql-tag';

import { compose } from 'recompose';
import { Grid, useTheme } from '@coursera/cds-core';
import { css, jsx } from '@emotion/react';

import waitForGraphQL from 'js/lib/waitForGraphQL';
import user from 'js/lib/user';

import CourseNextStepContainer from 'bundles/course-home/page-course-welcome/next-step-card/components/CourseNextStepContainer';
import CourseProgressBar from 'bundles/course-home/page-course-welcome/progress-bar/components/CourseProgressBar';
import CourseProgressBarV2 from 'bundles/course-home/page-course-welcome/progress-bar/v2/CourseProgressBarV2';
import CourseNextStep from 'bundles/course-home/page-course-welcome/next-step-card/v2/components/CourseNextStep';
import LearnerGoalCard from 'bundles/goal-setting/components/card/LearnerGoalCard';
import calculateHomeCardWidths from 'bundles/course-home/page-course-welcome/utils/calculateHomeCardWidths';

import type {
  GuidedCourseSessionProgressesV1MultiGetQueryVariables,
  GuidedCourseSessionProgressesV1MultiGetQuery,
  GuidedCourseSessionProgressesV1,
} from 'bundles/naptimejs/resources/__generated__/GuidedCourseSessionProgressesV1';

import type {
  GuidedCourseNextStepsV1MultiGetQueryVariables,
  GuidedCourseNextStepsV1MultiGetQuery,
  GuidedCourseNextStepsV1,
} from 'bundles/naptimejs/resources/__generated__/GuidedCourseNextStepsV1';

import { isLearningAssistantEnabled, isGoalSettingDisabled } from 'bundles/learning-assistant/utils/featureGates';
import { areCourseHomeTweaksEnabled } from 'bundles/course-home/page-course-welcome/utils/featureGates';
import { computeCourseProgress } from 'bundles/course-home/page-course-welcome/progress-bar/v2/utils';

type InputProps = {
  courseId: string;
  courseSlug: string;
};

type Props = InputProps & {
  courseNextStep: GuidedCourseNextStepsV1 | null;
  courseProgress: GuidedCourseSessionProgressesV1 | null;
};

export const CourseHomeCards: React.FC<Props> = ({ courseProgress, courseNextStep, courseSlug, courseId }) => {
  const theme = useTheme();
  const tweaksEnabled = areCourseHomeTweaksEnabled();
  const isCourseCompleted = courseNextStep?.nextStep.typeName === 'courseCompletedNextStep';
  const progress = courseProgress && computeCourseProgress(courseProgress);

  const { percentComplete = 0 } = progress ?? {};

  const showProgressCard = !isCourseCompleted && percentComplete > 0 && percentComplete < 100;
  const showGoalCard = isLearningAssistantEnabled(courseId) && !isGoalSettingDisabled(courseId) && !isCourseCompleted;
  const nextStepType = courseNextStep?.nextStep.typeName;

  const { progressCardWidth, goalCardWidth, nextStepWidth } = calculateHomeCardWidths({
    showGoalCard,
    showProgressCard,
    nextStepType,
  });

  return tweaksEnabled ? (
    <Grid
      css={css`
        margin-bottom: ${theme.spacing(24)} !important;
      `}
      container
      spacing={24}
    >
      {showProgressCard && (
        <Grid item xs={progressCardWidth}>
          <CourseProgressBarV2 courseProgress={progress!} />
        </Grid>
      )}
      {showGoalCard && (
        <Grid item xs={goalCardWidth}>
          <LearnerGoalCard courseSlug={courseSlug} />
        </Grid>
      )}
      {courseNextStep && nextStepType && (
        <Grid item xs={nextStepWidth}>
          <CourseNextStep courseNextStep={courseNextStep} courseId={courseId} courseSlug={courseSlug} />
        </Grid>
      )}
    </Grid>
  ) : (
    <div className="welcome-content-legacy">
      {showProgressCard && <CourseProgressBar showAssignmentIcons />}
      {showGoalCard && <LearnerGoalCard courseSlug={courseSlug} />}
      <CourseNextStepContainer courseSlug={courseSlug} courseId={courseId} />
    </div>
  );
};

export default compose<Props, InputProps>(
  waitForGraphQL<
    Omit<Props, 'courseNextStep'>,
    GuidedCourseNextStepsV1MultiGetQuery,
    GuidedCourseNextStepsV1MultiGetQueryVariables,
    Props
  >(
    gql`
      query courseNextStep($ids: String!) {
        GuidedCourseNextStepsV1 @naptime {
          multiGet(ids: $ids) {
            elements {
              id
              nextStep
            }
          }
        }
      }
    `,
    {
      options: ({ courseSlug }) => ({
        variables: {
          ids: `${user.get().id}~${courseSlug}`,
        },
        errorPolicy: 'all',
      }),
      props: ({ ownProps, data }) => ({
        ...ownProps,
        courseNextStep: data?.GuidedCourseNextStepsV1?.multiGet?.elements?.[0] ?? null,
      }),
    }
  ),
  waitForGraphQL<
    Omit<Props, 'courseProgress'>,
    GuidedCourseSessionProgressesV1MultiGetQuery,
    GuidedCourseSessionProgressesV1MultiGetQueryVariables,
    Props
  >(
    gql`
      query courseGradesProgressesQuery($ids: String!) {
        GuidedCourseSessionProgressesV1 @naptime {
          multiGet(ids: $ids) {
            elements {
              id
              weeks
              courseProgressState
            }
          }
        }
      }
    `,
    {
      options: ({ courseSlug }) => ({
        variables: {
          ids: `${user.get().id}~${courseSlug}`,
        },
        errorPolicy: 'all',
      }),
      props: ({ ownProps, data }) => ({
        ...ownProps,
        courseProgress: data?.GuidedCourseSessionProgressesV1?.multiGet?.elements?.[0] ?? null,
      }),
    }
  )
)(CourseHomeCards);
