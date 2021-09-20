import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import DueDateHelpers from 'app/scripts/views/internal/due-date-helpers';
import { forTemplate } from '@trello/i18n';

import styles from './DueDateSection.less';
import { Checkbox } from '@trello/nachos/checkbox';
import { Gutter } from './Gutter';

const format = forTemplate('card_detail');

interface DueDateSectionProps {
  startDate?: string | null;
  dueDate?: string | null;
  isComplete: boolean;
}

const StartDate = ({ startDate }: { startDate: string }) => {
  const formattedStartDate = moment(startDate).calendar();

  return (
    <div>
      <h3 className={styles.heading}>{format('start-date')}</h3>
      <div className={styles.dateBadge}>{formattedStartDate}</div>
    </div>
  );
};

const DueDate = ({
  dueDate,
  isComplete,
}: {
  dueDate: string;
  isComplete: boolean;
}) => {
  const formattedDueDate = moment(dueDate).calendar();
  const status = DueDateHelpers.relativeInfoForDueDate(dueDate, isComplete);
  const classicClassName = DueDateHelpers.classForDueDate(dueDate, isComplete);

  return (
    <div>
      <h3 className={styles.heading}>{format('due-date')}</h3>
      <div className={styles.dueDateCheckboxAndBadge}>
        <Checkbox
          readOnly
          isChecked={isComplete}
          className={styles.dueDateCheckbox}
        />
        <div className={styles.dateBadge}>
          {formattedDueDate}
          {status && (
            <div
              className={classNames(styles.dueDateStatusLozenge, {
                [styles.duePast]: classicClassName === 'is-due-past',
                [styles.complete]: classicClassName === 'is-due-complete',
                [styles.dueNow]: classicClassName === 'is-due-now',
                [styles.dueSoon]: classicClassName === 'is-due-soon',
              })}
            >
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const DueDateSection = ({
  startDate,
  dueDate,
  isComplete,
}: DueDateSectionProps) => (
  <Gutter>
    <div className={styles.dueDateSection}>
      {startDate && <StartDate startDate={startDate} />}
      {dueDate && <DueDate dueDate={dueDate} isComplete={isComplete} />}
    </div>
  </Gutter>
);
