/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React from 'react';
import { Typography } from '@coursera/cds-core';

import { getFormattedDeadline } from 'bundles/ondemand/utils/deadlineFormatter';
import CountdownTimer from 'bundles/compound-assessments/components/shared/cds/CountdownTimer';

import type moment from 'moment';
import type { Theme } from '@coursera/cds-core';

import _t from 'i18n!nls/compound-assessments';

type Deadline = number | moment.Moment;

type Props = {
  deadline?: Deadline;
  remainingTimeInMs?: number | null;
  timerId?: string;
  showTimer?: boolean;
  pageStatusComponent?: React.ReactNode;
};

const styles = {
  dueText: (theme: Theme) =>
    css({
      marginRight: theme.spacing(8),
    }),
};

const HeaderRight = ({ deadline, remainingTimeInMs, timerId, showTimer, pageStatusComponent }: Props) => (
  <div>
    {deadline && (
      <div>
        <Typography variant="h4bold" component="span" css={styles.dueText}>
          {_t('Due')}
        </Typography>
        <Typography variant="body2" component="span">
          {getFormattedDeadline(deadline)}
        </Typography>
      </div>
    )}
    {pageStatusComponent}
    {showTimer && typeof remainingTimeInMs === 'number' && timerId && (
      <div>
        <CountdownTimer timerId={timerId} remainingTimeInMs={remainingTimeInMs} displayRemaining={true} />
      </div>
    )}
  </div>
);

export default HeaderRight;
