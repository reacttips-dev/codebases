import React, { useRef, useState } from 'react';
import cx from 'classnames';

import {
  ActionSubjectIdType,
  Analytics,
  SourceType,
} from '@trello/atlassian-analytics';
import { Button } from '@trello/nachos/button';
import { DownIcon } from '@trello/nachos/icons/down';
import { Popover, PopoverPlacement, usePopover } from '@trello/nachos/popover';
import { UpIcon } from '@trello/nachos/icons/up';

import { forTemplate } from '@trello/i18n';

import { JumpToCalendar } from './JumpToCalendar';
import { ViewType } from './types';

import styles from './DateButton.less';

const format = forTemplate('views');

interface DateButtonProps {
  viewName: ViewType;
  dateText: string;
  onNavigateToDate: (date: Date) => void;
  events: { start: Date; end: Date }[];
  defaultDate: Date;
  shouldNotNavigate?: (day: Date) => boolean;
  disableCalPopoverOnLarge?: boolean;
  analyticsContainers: {
    board?: { id: string | null };
    organization?: { id: string | null };
    enterprise?: { id: string | null };
  };
}

export const DateButton: React.FunctionComponent<DateButtonProps> = ({
  viewName,
  dateText,
  onNavigateToDate,
  events,
  defaultDate,
  shouldNotNavigate,
  disableCalPopoverOnLarge,
  analyticsContainers,
}) => {
  const { popoverProps } = usePopover<HTMLElement, HTMLDivElement>();

  const dateButtonRef = useRef<HTMLButtonElement>(null);

  const [
    showJumpToCalendarPopover,
    setShowJumpToCalendarPopover,
  ] = useState<boolean>(false);

  const togglePopover = () => {
    // Only send the event when we open the popover
    if (!showJumpToCalendarPopover) {
      let buttonName: ActionSubjectIdType = 'calendarOpenJumpToDateButton';
      let source: SourceType = 'calendarViewScreen';
      if (viewName === ViewType.TIMELINE) {
        buttonName = 'timelineOpenJumpToDateButton';
        source = 'timelineViewScreen';
      }

      Analytics.sendClickedButtonEvent({
        buttonName,
        source,
        containers: analyticsContainers,
      });
    }

    setShowJumpToCalendarPopover(!showJumpToCalendarPopover);
  };

  return (
    <>
      <Button
        className={cx(
          styles.dateButton,
          disableCalPopoverOnLarge && styles.disableOnLargeScreen,
        )}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={togglePopover}
        iconAfter={
          showJumpToCalendarPopover ? (
            <UpIcon size="small" dangerous_className={styles.caretIcon} />
          ) : (
            <DownIcon size="small" dangerous_className={styles.caretIcon} />
          )
        }
        ref={dateButtonRef}
      >
        <span className={styles.dateText}>{dateText}</span>
      </Button>
      <Popover
        {...popoverProps}
        title={format('jump-to-date')}
        // eslint-disable-next-line react/jsx-no-bind
        onHide={togglePopover}
        isVisible={showJumpToCalendarPopover}
        triggerElement={dateButtonRef.current}
        placement={PopoverPlacement.BOTTOM_START}
        dangerous_width={350}
      >
        <JumpToCalendar
          events={events}
          // eslint-disable-next-line react/jsx-no-bind
          onNavigateToDate={(newDate: Date) => {
            togglePopover();
            onNavigateToDate(newDate);
          }}
          defaultDate={defaultDate}
          shouldNotNavigate={shouldNotNavigate}
          viewName={viewName}
          analyticsContainers={analyticsContainers}
        />
      </Popover>
    </>
  );
};
