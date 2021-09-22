/* @jsx jsx */
import React from 'react';

import { jsx, css } from '@emotion/react';
import { H2Bold } from '@coursera/coursera-ui';

import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/goal-setting';

import 'css!./__styles__/SegmentedProgressCircle';
import { Grid, Typography, useTheme } from '@coursera/cds-core';

type Props = {
  totalSteps: number; // TODO: increase type specificity: 2 | 3 | 5;
  completedSteps: number; // TODO: increase type specificity: 0 | 1 | 2 | 3 | 4 | 5;
  size?: number;
};

const SegmentedProgressCircle: React.FC<Props> = ({ totalSteps, completedSteps, size }) => {
  const strokeWidth = 6;
  const theme = useTheme();
  const radius = size! / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completedSteps / totalSteps / 100) * circumference;

  return (
    <div
      css={css`
        position: relative;
        width: ${size}px;
        height: ${size}px;

        & > * {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
        }
      `}
    >
      <Grid direction="column" alignItems="center" container justify="center">
        <Grid item>
          <Typography variant="h2semibold">{completedSteps}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2">
            <FormattedMessage
              message={_t(`{completedSteps, plural, =1 {day} other {days}}`)}
              completedSteps={completedSteps}
            />
          </Typography>
        </Grid>
      </Grid>

      <Grid container justify="center" alignItems="center">
        <Grid item>
          <svg
            css={css`
              transform: rotate(-90deg);
              transform-origin: center;
              margin-top: ${theme.spacing(8)};
            `}
            width={size}
            height={size}
          >
            <circle
              css={css`
                opacity: 0.3;
              `}
              stroke={theme.palette.gray[400]}
              stroke-width="6"
              fill="transparent"
              r={radius}
              cx={size! / 2}
              cy={size! / 2}
            />

            <circle
              stroke={theme.palette.green[700]}
              css={css`
                stroke-dasharray: ${circumference} ${circumference};
                stroke-dashoffset: ${offset};
              `}
              stroke-width="6"
              fill="transparent"
              r={radius}
              cx={size! / 2}
              cy={size! / 2}
            />
          </svg>
        </Grid>
      </Grid>
    </div>
  );
};

SegmentedProgressCircle.defaultProps = {
  size: 100,
};

export default SegmentedProgressCircle;
