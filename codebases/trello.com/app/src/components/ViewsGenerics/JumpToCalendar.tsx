import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import _ from 'underscore';
import moment from 'moment';
import cx from 'classnames';

import {
  ActionSubjectIdType,
  Analytics,
  SourceType,
} from '@trello/atlassian-analytics';
import { getDateWithAddedMonths, isDateToday } from '@trello/dates';
import { BackIcon } from '@trello/nachos/icons/back';
import { Button } from '@trello/nachos/button';
import { ForwardIcon } from '@trello/nachos/icons/forward';

import { Feature } from 'app/scripts/debug/constants';
import { Dates } from 'app/scripts/lib/dates';
import { DraggableContext } from 'app/src/components/BoardCalendarView/Draggable';
import {
  getDaysToRenderForMonth,
  getGenericEventsForRange,
  isInRange,
} from 'app/src/components/BoardCalendarView/helpers';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';

import { ViewType } from './types';

import styles from './JumpToCalendar.less';

interface JumpToCalendarProps {
  events: { start: Date; end: Date }[];
  onNavigateToDate: (date: Date) => void;
  defaultDate: Date;
  selectedDate?: Date;
  shouldNotNavigate?: (day: Date) => boolean;
  viewName: ViewType;
  analyticsContainers: {
    board?: { id: string | null };
    organization?: { id: string | null };
    enterprise?: { id: string | null };
  };
  includeDateCellData?: boolean;
  className?: string;
}

export const JumpToCalendar: React.FunctionComponent<JumpToCalendarProps> = ({
  events,
  onNavigateToDate,
  defaultDate,
  selectedDate,
  shouldNotNavigate,
  viewName,
  analyticsContainers,
  includeDateCellData,
  className,
}) => {
  const [focusedDay, setFocusedDay] = useState(defaultDate);
  const [visibleMonth, setVisibleMonth] = useState(
    Dates.getFirstOfMonth(defaultDate),
  );

  useEffect(() => {
    if (selectedDate && selectedDate !== focusedDay) {
      setFocusedDay(selectedDate);
    }

    if (selectedDate && !moment(selectedDate).isSame(visibleMonth, 'month')) {
      setVisibleMonth(Dates.getFirstOfMonth(selectedDate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const [daysToRender, daysToRenderByWeek] = useMemo(() => {
    const daysToRender = getDaysToRenderForMonth(visibleMonth);
    const daysToRenderByWeek = _.chunk(daysToRender, 7) as Date[][];

    return [daysToRender, daysToRenderByWeek];
  }, [visibleMonth]);

  const eventsInRange = useMemo(() => {
    return getGenericEventsForRange(
      events,
      daysToRender[0],
      daysToRender[daysToRender.length - 1],
    );
  }, [daysToRender, events]);

  const containsEvent = (day: Date) => {
    return eventsInRange.some(({ start, end }) =>
      isInRange(
        { start, end },
        moment(day).startOf('day').toDate(),
        moment(day).endOf('day').toDate(),
      ),
    );
  };

  const handleDayClick = (day: Date) => {
    setFocusedDay(day);

    if (!shouldNotNavigate || !shouldNotNavigate(day)) {
      let buttonName: ActionSubjectIdType = 'calendarJumpToDateButton';
      let source: SourceType = 'calendarViewScreen';
      if (viewName === ViewType.TIMELINE) {
        buttonName = 'timelineJumpToDateButton';
        source = 'timelineViewScreen';
      }

      Analytics.sendClickedButtonEvent({
        buttonName,
        source,
        containers: analyticsContainers,
      });

      onNavigateToDate(day);
    }
  };

  const navigateMonthBack = useCallback(
    () => setVisibleMonth(getDateWithAddedMonths(visibleMonth, -1)),
    [visibleMonth],
  );

  const navigateMonthForward = useCallback(
    () => setVisibleMonth(getDateWithAddedMonths(visibleMonth, 1)),
    [visibleMonth],
  );

  const { draggableState } = useContext(DraggableContext),
    { currentSlot, isDragging } = draggableState;

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-ecosystem',
        feature: Feature.CalendarView,
      }}
    >
      <div className={cx(className)}>
        <div className={styles.header}>
          <Button
            className={styles.headerButton}
            onClick={navigateMonthBack}
            iconAfter={<BackIcon size="small" />}
          />
          <div className={styles.focusedDateText}>
            {moment(visibleMonth).format('MMMM YYYY')}
          </div>
          <Button
            className={styles.headerButton}
            onClick={navigateMonthForward}
            iconAfter={<ForwardIcon size="small" />}
          />
        </div>
        <div className={styles.dayOfWeekNames}>
          {daysToRender.slice(0, 7).map((date, index) => (
            <div className={styles.dayOfWeek} key={index}>
              {moment(date).format('ddd')}
            </div>
          ))}
        </div>
        {daysToRenderByWeek.map((week, weekIndex) => (
          <div className={styles.dateWeek} key={weekIndex}>
            {week.map((day, dayIndex) => {
              const isSelected = moment(day).isSame(focusedDay, 'day');

              return (
                <div
                  className={cx(
                    styles.dateDay,
                    visibleMonth.getMonth() !== day.getMonth() &&
                      styles.isOffRange,
                    isDateToday(day) && styles.isToday,
                    isSelected && styles.isSelected,
                    isDragging && styles.noCursor,
                    isDragging
                      ? currentSlot &&
                          moment(day).isSame(currentSlot, 'day') &&
                          styles.highlighted
                      : styles.showHover,
                  )}
                  key={dayIndex}
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={() => (isSelected ? null : handleDayClick(day))}
                  role="button"
                  {...(includeDateCellData && {
                    ['data-date-range']: true,
                    ['data-date-range-start']: day.getTime(),
                    ['data-date-range-length']: 1,
                    ['data-date-update-day-only']: true,
                  })}
                >
                  <div>{moment(day).format('D')}</div>
                  <div
                    className={cx(
                      styles.hasEventDot,
                      containsEvent(day) && styles.show,
                    )}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </ErrorBoundary>
  );
};
