import React from 'react';
import { P, Strong } from '@coursera/coursera-ui';

import { getFormattedDeadline } from 'bundles/ondemand/utils/deadlineFormatter';
import CountdownTimer from 'bundles/compound-assessments/components/shared/CountdownTimer';

import moment from 'moment';

import initBem from 'js/lib/bem';

import _t from 'i18n!nls/compound-assessments';

import 'css!./__styles__/HeaderRight';

const bem = initBem('HeaderRight');

type Deadline = number | moment.Moment;

type Props = {
  deadline?: Deadline;
  remainingTimeInMs?: number | null;
  timerId?: string;
  showTimer?: boolean;
  pageStatusComponent?: React.ReactNode;
};

const HeaderRight = ({ deadline, remainingTimeInMs, timerId, showTimer, pageStatusComponent }: Props) => (
  <div className={bem()}>
    {deadline && (
      <P rootClassName={bem('deadline')}>
        <Strong>{_t('Due')}</Strong> {getFormattedDeadline(deadline)}
      </P>
    )}
    {pageStatusComponent}
    {showTimer && typeof remainingTimeInMs === 'number' && timerId && (
      <P rootClassName={bem('timer')}>
        <CountdownTimer timerId={timerId} remainingTimeInMs={remainingTimeInMs} displayRemaining={true} />
      </P>
    )}
  </div>
);

export default HeaderRight;
