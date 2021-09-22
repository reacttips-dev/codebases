/* @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';
import { Button, Typography, useTheme } from '@coursera/cds-core';

import TrackedButton from 'bundles/page/components/TrackedButton';

import withCustomLabelsByUserAndCourse from 'bundles/custom-labels/hoc/withCustomLabelsByUserAndCourse';
import getNextUpContent from 'bundles/course-home/page-course-welcome/next-step-card/v2/utils/getNextUpContent';

import type { CourseNextStepCourseMaterialNextStep } from 'bundles/naptimejs/resources/__generated__/GuidedCourseNextStepsV1';
import type { ReplaceCustomContent } from 'bundles/custom-labels/types/CustomLabels';
import { humanizeLearningTime } from 'js/utils/DateTimeUtils';

import _t from 'i18n!nls/course-home';

type InputProps = {
  courseId: string;
  courseNextStep: CourseNextStepCourseMaterialNextStep;
  buttonText: string;
  buttonLink: string;
};

type Props = InputProps & {
  replaceCustomContent: ReplaceCustomContent;
};

export const CourseMaterialNextUp: React.FunctionComponent<Props> = ({
  replaceCustomContent,
  courseId,
  buttonLink,
  buttonText,
  courseNextStep,
}) => {
  const theme = useTheme();

  const {
    currentWeekNumberByProgress,
    item,
    item: {
      timeCommitment,
      contentSummary: { typeName },
    },
  } = courseNextStep?.definition ?? {};

  const { label, icon } = getNextUpContent(courseId, item.id, typeName);

  const subtitle = replaceCustomContent(_t('{capitalizedWeekWithNumber} | {label} • {timeCommitment}'), {
    weekNumber: currentWeekNumberByProgress,
    additionalVariables: {
      label,
      timeCommitment: humanizeLearningTime(timeCommitment),
    },
  });

  return (
    <div
      css={css`
        flex-direction: row;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
      `}
    >
      <div
        css={css`
          margin-top: ${theme.spacing(16)};
          user-select: none;
          display: flex;
          margin-right: ${theme.spacing(32)};
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
        `}
      >
        {icon}
        <div>
          <Typography
            css={css`
              color: ${theme.palette.blue[600]};
            `}
            variant="h3semibold"
          >
            {item.name}
          </Typography>
          <Typography
            css={css`
              margin: ${theme.spacing(0)};
            `}
            variant="body2"
            color="supportText"
          >
            {subtitle}
          </Typography>
        </div>
      </div>
      <Button
        trackingName="next_step_action_v2"
        withVisibilityTracking={false}
        variant="primary"
        size="medium"
        component={TrackedButton}
        requireFullyVisible={false}
        css={css`
          margin-top: ${theme.spacing(16)};
        `}
        onClick={() => window.open(buttonLink, '_self')}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default withCustomLabelsByUserAndCourse<InputProps>(CourseMaterialNextUp);
