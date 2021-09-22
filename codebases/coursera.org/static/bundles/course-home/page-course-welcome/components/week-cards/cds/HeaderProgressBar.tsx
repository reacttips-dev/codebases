/** @jsx jsx */
import React from 'react';

import { Box } from '@coursera/coursera-ui';
// eslint-disable-next-line
import { css, jsx } from '@emotion/react';
import { Typography, Theme } from '@coursera/cds-core';
import { humanizeLearningTime } from 'js/utils/DateTimeUtils';

import { WeekStatus } from 'bundles/course-v2/types/Week';

import _t from 'i18n!nls/course-home';

import 'css!./../__styles__/HeaderProgressBar';

type Props = {
  remainingDuration: number;
  totalDuration: number;
  weekStatus: WeekStatus;
  theme: Theme;
};

const normalize = (n: number, min: number, max?: number) => {
  if (typeof max !== 'undefined') {
    return Math.min(Math.max(n, min), max);
  }
  return Math.max(n, min);
};

const HeaderProgressBar: React.FunctionComponent<Props> = ({ weekStatus, remainingDuration, totalDuration, theme }) => {
  const normalizedRemaining = normalize(remainingDuration, 0);
  const normalizedTotal = normalize(totalDuration, 0);

  if (normalizedTotal === 0 || weekStatus === 'COMPLETED') {
    return null;
  }

  const percentage = normalize((1 - normalizedRemaining / normalizedTotal) * 100, 0, 100);
  const remainingString = humanizeLearningTime(normalizedRemaining);

  return (
    <Box rootClassName="rc-HeaderProgressBar" flexDirection="row" alignItems="center">
      {normalizedRemaining < normalizedTotal && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percentage}%` }} />
        </div>
      )}
      {remainingString.length > 0 && (
        <Typography
          variant="h3semibold"
          css={css`
            margin: ${theme?.spacing(0, 0, 0, 16)};
          `}
        >
          {_t('#{remaining} left', { remaining: remainingString })}
        </Typography>
      )}
    </Box>
  );
};

export default HeaderProgressBar;
