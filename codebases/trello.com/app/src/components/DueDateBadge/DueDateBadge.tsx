import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import styles from './DueDateBadge.less';
import { formatHumanDate } from '@trello/dates';
import { Dates } from 'app/scripts/lib/dates';
import DueDateHelpers from 'app/scripts/views/internal/due-date-helpers';
import moment from 'moment';
import cx from 'classnames';
import { ClockIcon } from '@trello/nachos/icons/clock';
import { TestId } from '@trello/test-ids';

interface DueDateBadgeProps {
  className?: string;
  complete?: boolean;
  due: Date | null;
  onClick?: React.MouseEventHandler;
  testId?: TestId;
}

export const DateEvents = (Dates as unknown) as {
  on: (event: 'renderInterval', callback: (now: number) => void) => void;
  off: (event: 'renderInterval', callback: (now: number) => void) => void;
};

function classForDue(
  due: Date | null,
  complete: boolean | undefined,
  now: number,
) {
  return due
    ? DueDateHelpers.classForDueDate(
        moment(due).toDate(),
        complete || false,
        now,
      )
    : 'unset';
}

export const DueDateBadge: FunctionComponent<DueDateBadgeProps> = function ({
  className: customClassName,
  complete,
  due,
  onClick,
  testId,
}: DueDateBadgeProps) {
  const [now, setNow] = useState(Date.now());

  // Periodically update the current time, so we can keep
  // the color of the badge current
  useEffect(() => {
    DateEvents.on('renderInterval', setNow);
    return () => DateEvents.off('renderInterval', setNow);
  }, []);

  const dueClassName = useMemo(() => classForDue(due, complete, now), [
    complete,
    due,
    now,
  ]);

  const className = cx(styles.badge, styles[dueClassName], customClassName);

  const dueText = due && formatHumanDate(due);
  const contents = (
    <>
      <ClockIcon
        dangerous_className={styles.icon}
        color={
          ['is-due-future', 'unset'].includes(dueClassName) ? 'dark' : 'light'
        }
        size="small"
      ></ClockIcon>
      {dueText}
    </>
  );

  return onClick ? (
    <button className={className} onClick={onClick} data-test-id={testId}>
      {contents}
    </button>
  ) : dueText ? (
    <span className={className} data-test-id={testId}>
      {contents}
    </span>
  ) : null;
};
