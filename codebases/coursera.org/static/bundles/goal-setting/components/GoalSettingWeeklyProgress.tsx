/* @jsx jsx */
import React from 'react';

import { Grid, Typography } from '@coursera/cds-core';
import { css, jsx } from '@emotion/react';
import { SuccessFilledIcon } from '@coursera/cds-icons';

import { DayOfWeek, DAYS_OF_WEEK } from 'bundles/goal-setting/utils/constants';

import 'css!./__styles__/GoalSettingWeeklyProgress';

type Props = {
  completedDays: DayOfWeek[];
};

export const GoalSettingWeeklyProgress: React.FC<Props> = ({ completedDays }) => {
  const circleSize = 24;

  return (
    <Grid container direction="row" spacing={16}>
      {Object.keys(DAYS_OF_WEEK).map((day) => (
        <Grid xs container item key={day} direction="column" alignItems="center" justify="center" spacing={4}>
          {/* // ts-expect-error */}
          <Grid
            css={css`
              height: ${circleSize}px;
            `}
            item
          >
            {completedDays.includes(day as DayOfWeek) ? (
              <SuccessFilledIcon color="success" size="large" />
            ) : (
              <svg width={circleSize} height={circleSize}>
                <circle cy="12" cx="12" fill="transparent" r="12" stroke="#E5E7E8" strokeWidth={1} />
              </svg>
            )}
          </Grid>
          <Grid item>
            <Typography variant="body2" color="supportText">
              {DAYS_OF_WEEK[day]}
            </Typography>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

GoalSettingWeeklyProgress.defaultProps = {
  completedDays: [],
};

export default GoalSettingWeeklyProgress;
