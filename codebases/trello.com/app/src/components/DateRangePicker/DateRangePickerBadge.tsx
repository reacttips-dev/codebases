import React from 'react';
import moment from 'moment';
import styles from './DateRangePickerBadge.less';
import cx from 'classnames';
import { forTemplate } from '@trello/i18n';
import { LazyDateRangePicker, Choice } from './LazyDateRangePicker';

import { Popover, usePopover } from '@trello/nachos/popover';
import { Button } from '@trello/nachos/button';
import { DownIcon } from '@trello/nachos/icons/down';

import { DateRangePickerTestIds } from '@trello/test-ids';
import { Analytics, ActionSubjectIdType } from '@trello/atlassian-analytics';
import { useFeatureFlag } from '@trello/feature-flag-client';

import { calendarFormatWithoutTime } from 'app/scripts/data/moment/calendarFormatWithoutTime';

const format = forTemplate('due_date_picker');

type ClassForDueDate =
  | 'is-due-complete'
  | 'is-due-soon'
  | 'is-due-now'
  | 'is-due-past';

interface DateRangePickerBadgeProps {
  type: 'startDate' | 'dueDate';
  relativeDueDateStatus?: string;
  classForDueDate?: ClassForDueDate;
  due?: string | null;
  start?: string | null;
  dueReminder?: number | null;
  idCard: string;
  idBoard?: string;
  idOrg?: string;
  canEdit?: boolean;
}

// based off of the formatHumanDate in the dates.ts package, but with extra
// functionality to add time or force the year to be shown.
const formatHumanDate = (
  momentDate: moment.Moment,
  withTime?: boolean,
  forceYear?: boolean,
) => {
  const now = moment();

  const isAmbiguousMonth = Math.abs(now.diff(momentDate, 'months')) > 9;
  const shouldHideYear =
    momentDate.isSame(now, 'year') && !isAmbiguousMonth && !forceYear;

  if (withTime) {
    const withYear = moment.localeData().calendar('sameElse', momentDate);
    const withoutYear = moment.localeData().calendar('sameYear', momentDate);
    return momentDate.format(shouldHideYear ? withoutYear : withYear);
  }
  return momentDate.format(shouldHideYear ? 'llll' : 'll');
};

/** Either a start date or due date badge on the card back. Opens a Date Range Picker popover when clicked. */
export const DateRangePickerBadge: React.FC<DateRangePickerBadgeProps> = ({
  type,
  relativeDueDateStatus,
  classForDueDate,
  due,
  start,
  dueReminder,
  idCard,
  idBoard,
  idOrg,
  canEdit,
}) => {
  const {
    triggerRef,
    toggle,
    hide,
    popoverProps,
  } = usePopover<HTMLButtonElement>();

  // if true, the user will see a single combined date badge if both the start and due exist.
  const combinedBadge = useFeatureFlag(
    'ecosystem.combined-card-back-date-badges',
    false,
  );

  const trackingContainers = {
    card: { id: idCard },
    board: { id: idBoard },
    organization: { id: idOrg },
  };

  let buttonName: ActionSubjectIdType;

  let text, testId;
  if (type === 'startDate' && start) {
    // we want to render relative time words if possible, but without the time portion (for start dates)
    // so we'll use moment's calendar() formatter with our localized date formats without the time.
    const calendarFormat = calendarFormatWithoutTime[moment.locale()];
    text = moment(start).calendar(undefined, calendarFormat);
    testId = DateRangePickerTestIds.StartDateBadgeWithDateRangePicker;
    buttonName = 'startDateBadge';
  } else if (type === 'dueDate' && due) {
    if (combinedBadge && start) {
      // relative time words are awkward in date ranges, so we won't use moment's calendar() here.
      const momentStart = moment(start);
      const momentDue = moment(due);
      const forceYear = !momentStart.isSame(momentDue, 'year'); // force the years to be shown if the dates are in different years.

      const startString = formatHumanDate(momentStart, false, forceYear);
      const dueString = formatHumanDate(momentDue, true, forceYear);
      text = `${startString} - ${dueString}`;
    } else {
      text = moment(due).calendar();
    }
    testId = DateRangePickerTestIds.DueDateBadgeWithDateRangePicker;
    buttonName = 'dueDateBadge';
  }

  let dueDateStatusLozenge;
  if (relativeDueDateStatus && classForDueDate) {
    dueDateStatusLozenge = (
      <span
        className={cx(styles.dueDateStatusLozenge, styles[classForDueDate])}
      >
        {relativeDueDateStatus}
      </span>
    );
  }

  const initialChoice =
    type === 'startDate' ? Choice.StartDate : Choice.DueDate;

  return (
    <>
      <Button
        className={styles.button}
        iconAfter={<DownIcon size="small" color="gray" />}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => {
          if (canEdit) {
            Analytics.sendClickedButtonEvent({
              buttonName,
              source: 'cardDetailScreen',
              containers: trackingContainers,
            });
            toggle();
          }
        }}
        ref={triggerRef}
        testId={testId}
      >
        <span>{text}</span>
        {dueDateStatusLozenge}
      </Button>
      <Popover {...popoverProps} title={format('dates')} size="medium">
        <LazyDateRangePicker
          due={due}
          start={start}
          dueReminder={dueReminder}
          hidePopover={hide}
          idCard={idCard}
          idBoard={idBoard}
          idOrg={idOrg}
          initialChoice={initialChoice}
        />
      </Popover>
    </>
  );
};
