/* @jsx jsx */
import React from 'react';

import { Grid, useTheme, Typography } from '@coursera/cds-core';
import { CardV2 } from '@coursera/coursera-ui';
import { SvgCheckSolid } from '@coursera/coursera-ui/svg';
import { css, jsx } from '@emotion/react';

import { humanizeLearningTime } from 'js/utils/DateTimeUtils';

import { CourseProgress } from 'bundles/course-home/page-course-welcome/progress-bar/v2/utils';

import _t from 'i18n!nls/course-home';

type Props = {
  courseProgress: CourseProgress;
};

const CourseProgressBarV2Styles = (theme) => ({
  progress: css`
    border-radius: 100px;
    height: 6px;
    display: block;
  `,
  progressBar: css`
    width: 100%;
    margin-bottom: ${theme.spacing(24)};
    background: ${theme.palette.gray[100]};
  `,
  progressFill: css`
    background: ${theme.palette.green[700]};
  `,
  card: css`
    height: 100%;

    .rc-CourseProgressBarV2 {
      padding: ${theme.spacing(24)};
      border-radius: 0;
      height: 100%;
    }
  `,
  completionPercent: css`
    margin: ${theme.spacing(12, 0, 4)};
    width: 100%;
  `,
});

export const CourseProgressBarV2: React.FunctionComponent<Props> = ({
  courseProgress: { percentComplete, totalAssignments: total, timeRemaining, completedAssignments: complete },
}) => {
  const theme = useTheme();
  const styles = CourseProgressBarV2Styles(theme);

  const totalAssignments = Math.max(total, 0);
  const completionPercent = Math.floor(Math.max(Math.min(percentComplete, 1), 0) * 100);
  const completedAssignments = Math.max(Math.min(complete, totalAssignments), 0);

  return (
    <div css={styles.card}>
      <CardV2 rootClassName="rc-CourseProgressBarV2" showBorder>
        <Typography variant="h2semibold">{_t('Overall Progress')}</Typography>

        <Grid css={styles.completionPercent} container direction="row" alignItems="center" justify="space-between">
          <Typography
            css={css`
              font-weight: bold;
            `}
            variant="body1"
          >
            {percentComplete > 0 && (
              <Grid item>
                <span>{_t('#{completionPercent}%', { completionPercent })}</span>
              </Grid>
            )}

            {
              // Only render the time remaining if there's < 75% less to the course
              // and under 3 hours of learning time
              percentComplete >= 0.75 && timeRemaining > 0 && timeRemaining <= 10800000 && (
                <Grid item>
                  <span>{_t('#{timeRemaining} left', { timeRemaining: humanizeLearningTime(timeRemaining) })}</span>
                </Grid>
              )
            }
          </Typography>
        </Grid>

        <div css={[styles.progress, styles.progressBar]} className="progress-bar">
          <span style={{ width: `${completionPercent}%` }} css={[styles.progress, styles.progressFill]} />
        </div>

        <Grid container direction="row" alignItems="center" justify="flex-start">
          {completedAssignments >= totalAssignments && (
            <Grid item>
              <SvgCheckSolid style={{ marginRight: '0.5rem' }} color="#1D7C50" size={23} />
            </Grid>
          )}
          <Grid item>
            <Typography variant="body2">
              {completedAssignments < 1
                ? _t('#{totalAssignments} assignments left to complete', { totalAssignments })
                : _t('#{completedAssignments}/#{totalAssignments} assignments completed', {
                    completedAssignments,
                    totalAssignments,
                  })}
            </Typography>
          </Grid>
        </Grid>
      </CardV2>
    </div>
  );
};

export default CourseProgressBarV2;
