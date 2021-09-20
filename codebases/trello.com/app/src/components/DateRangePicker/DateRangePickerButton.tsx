import React from 'react';
import classnames from 'classnames';
import styles from './DateRangePickerButton.less';
import { forTemplate } from '@trello/i18n';
import { LazyDateRangePicker } from './LazyDateRangePicker';

import { Popover, usePopover } from '@trello/nachos/popover';
import { Button } from '@trello/nachos/button';
import { ClockIcon } from '@trello/nachos/icons/clock';
import { useFeatureFlag } from '@trello/feature-flag-client';

import { Analytics } from '@trello/atlassian-analytics';
import { DateRangePickerTestIds } from '@trello/test-ids';
interface DateRangePickerButtonProps {
  due?: string | null;
  start?: string | null;
  dueReminder?: number | null;
  idCard: string;
  idBoard?: string;
  idOrg?: string;
  canEdit?: boolean;
  inContainer?: boolean;
}

const format = forTemplate('due_date_picker');

export const DateRangePickerButton: React.FC<DateRangePickerButtonProps> = ({
  due,
  start,
  dueReminder,
  idCard,
  idBoard,
  idOrg,
  canEdit,
  inContainer,
}) => {
  const {
    triggerRef,
    toggle,
    hide,
    popoverProps,
  } = usePopover<HTMLButtonElement>();

  const changeDueDatesToDatesFlag = useFeatureFlag(
    'ecosystem.change-due-dates-to-dates',
    false,
  );

  const trackingContainers = {
    card: { id: idCard },
    board: { id: idBoard },
    organization: { id: idOrg },
  };

  const containerStyle = inContainer ? styles.containerized : null;

  // this button appears on the sidebar on the card back, replacing the old Due Date button.
  // So we use some styling on the nachos button to match the look of other buttons.
  return (
    <>
      <Button
        className={classnames(styles.button, containerStyle)}
        iconBefore={<ClockIcon size="small" color="gray" />}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => {
          if (canEdit) {
            Analytics.sendClickedButtonEvent({
              buttonName: 'dateRangePickerButton',
              source: 'cardDetailScreen',
              containers: trackingContainers,
            });
            toggle();
          }
        }}
        ref={triggerRef}
        testId={DateRangePickerTestIds.CardBackDueDateButton}
      >
        <span className={styles.buttonLabel}>
          {changeDueDatesToDatesFlag ? format('dates') : format('due-date')}
        </span>
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
        />
      </Popover>
    </>
  );
};
