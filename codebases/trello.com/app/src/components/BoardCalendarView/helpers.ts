/* eslint-disable @trello/export-matches-filename, @typescript-eslint/no-use-before-define */
import moment, { Moment } from 'moment';

import { Dates } from 'app/scripts/lib/dates';

import { EventData, EventSegment } from './types';

// The Dates.getEndOfWeek method subtracts a day unless the
// last day is Saturday so that method breaks things when
// the locale has Sunday as the last day
const getEndOfWeek = (date: Date) => {
  return moment(date).endOf('week').toDate();
};

export const getDaysToRender = (firstDate: Date, lastDate: Date) => {
  const daysToRender = [],
    currentDay = moment(firstDate),
    lastDay = moment(lastDate);

  while (lastDay.diff(currentDay) >= 0) {
    daysToRender.push(currentDay.toDate());
    currentDay.add(1, 'day');
  }
  return daysToRender;
};

export const getDaysToRenderForMonth = (date: Date) => {
  const firstOfMonth = Dates.getFirstOfMonth(date),
    firstVisibleDay = Dates.getStartOfWeek(firstOfMonth),
    lastOfMonth = Dates.getLastOfMonth(date),
    lastVisibleDay = getEndOfWeek(lastOfMonth);

  return getDaysToRender(firstVisibleDay, lastVisibleDay);
};

export const getDaysToRenderForWeek = (date: Date) => {
  const firstOfWeek = Dates.getStartOfWeek(date),
    lastOfWeek = getEndOfWeek(date);

  return getDaysToRender(firstOfWeek, lastOfWeek);
};

export const isInRange = (
  { start, end }: { start: Date; end: Date },
  rangeStart: Date,
  rangeEnd: Date,
) => {
  const startDay = moment(start).startOf('day').toDate();
  const endDay = moment(end).startOf('day').toDate();

  return startDay <= rangeEnd && endDay >= rangeStart;
};

export const getGenericEventsForRange = (
  genericEvents: { start: Date; end: Date }[],
  startDate: Date,
  endDate: Date,
) => {
  return genericEvents.filter((genericEvent) =>
    isInRange(genericEvent, startDate, endDate),
  );
};

export const getEventsForRange = (
  events: EventData[],
  startDate: Date,
  endDate: Date,
) => {
  return events.filter((event) => isInRange(event, startDate, endDate));
};

export const sortEvents = (
  eventA: EventData,
  eventB: EventData,
  sortByTime: boolean = false,
) => {
  // 1. Sort by cards vs checklist items
  const isCardEventDiff =
    Number(!!eventA.isChecklistItem) - Number(!!eventB.isChecklistItem);
  if (isCardEventDiff) {
    return isCardEventDiff;
  }

  // 2. Sort by start day
  const momentAStart = moment(eventA.start),
    momentBStart = moment(eventB.start),
    momentAStartDay = momentAStart.startOf('day'),
    momentBStartDay = momentBStart.startOf('day'),
    startDayDiff = momentAStartDay.diff(momentBStartDay);
  if (startDayDiff) {
    return startDayDiff;
  }

  // 3. Sort by length of event in days
  const momentAEnd = moment(eventA.end);
  const momentBEnd = moment(eventB.end);
  const momentAEndDay = momentAEnd.clone().startOf('day'),
    momentBEndDay = momentBEnd.clone().startOf('day'),
    eventDurA = momentAEndDay.diff(momentAStartDay),
    eventDurB = momentBEndDay.diff(momentBStartDay),
    durationDiff = eventDurB - eventDurA;
  if (durationDiff) {
    return durationDiff;
  }

  // 3.5. Sort by time (optional)
  if (sortByTime) {
    const timeDiff = momentAEnd.diff(momentBEnd);
    if (timeDiff) {
      return timeDiff;
    }
  }

  const positionComparatorValue = sortByPosition(eventA, eventB);
  if (positionComparatorValue !== 0) {
    return positionComparatorValue;
  }

  return 0;
};

export const sortByPosition = (eventA: EventData, eventB: EventData) => {
  // 1. Sort by list position
  const listPositionDiff = eventA.data.listPosition - eventB.data.listPosition;
  if (listPositionDiff) {
    return listPositionDiff;
  }

  // 2. Sort by card position
  const cardPositionDiff = eventA.data.cardPosition - eventB.data.cardPosition;
  if (cardPositionDiff) {
    return cardPositionDiff;
  }

  // 3. Sort by checklist position
  if (
    (eventA.data.checklistPosition || eventA.data.checklistPosition === 0) &&
    (eventB.data.checklistPosition || eventB.data.checklistPosition === 0)
  ) {
    const checklistPositionDiff =
      eventA.data.checklistPosition - eventB.data.checklistPosition;
    if (checklistPositionDiff) {
      return checklistPositionDiff;
    }
  }

  // 4. Sort by checklist item position
  if (
    (eventA.data.checklistItemPosition ||
      eventA.data.checklistItemPosition === 0) &&
    (eventB.data.checklistItemPosition ||
      eventB.data.checklistItemPosition === 0)
  ) {
    const checklistItemPositionDiff =
      eventA.data.checklistItemPosition - eventB.data.checklistItemPosition;
    if (checklistItemPositionDiff) {
      return checklistItemPositionDiff;
    }
  }

  return 0;
};

export const getEventSegments = (events: EventData[], range: Date[]) => {
  return events.map((event: EventData) => {
    const startOfRange = moment(range[0]),
      endOfRange = moment(range[range.length - 1]),
      eventStart = moment(event.start),
      eventEnd = moment(event.end),
      maxSlots = numberOfDaysSpanned(startOfRange, endOfRange),
      segmentStart = moment.max(startOfRange, eventStart),
      segmentEnd = moment.min(endOfRange, eventEnd),
      slotsSpanned = Math.min(
        numberOfDaysSpanned(segmentStart, segmentEnd),
        maxSlots,
      ),
      leftSlot = range.findIndex(
        (date) => date.getDay() === segmentStart.day(),
      );

    return {
      event,
      slotsSpanned,
      leftSlot: Math.max(leftSlot, 0),
      rightSlot: Math.max(leftSlot + slotsSpanned - 1, 0),
      continuesBefore: eventStart.isBefore(segmentStart, 'day'),
      continuesAfter: eventEnd.isAfter(segmentEnd, 'day'),
    };
  });
};

export const segOverlaps = (
  segment: EventSegment,
  segmentArray: EventSegment[],
) => {
  return segmentArray.some(
    (existingSeg) =>
      existingSeg.leftSlot <= segment.rightSlot &&
      existingSeg.rightSlot >= segment.leftSlot,
  );
};

export const getEventLevels = (
  events: EventData[],
  range: Date[],
  maxLevels = Infinity,
  previewSegment?: EventSegment,
): [EventSegment[][], EventSegment[]] => {
  let previewSegmentUsed = !previewSegment;

  const eventSegments = getEventSegments(events, range);
  const levels: EventSegment[][] = [],
    extra: EventSegment[] = [];

  eventSegments.forEach((segment) => {
    let levelIndex;
    for (levelIndex = 0; levelIndex < levels.length; levelIndex++) {
      // Check to see if this event overlaps with any other event
      // in this level
      if (!segOverlaps(segment, levels[levelIndex])) {
        // If this event doesn't overlap, we can render this event
        // in the current level if:
        // - `isChecklistItem` is not true OR
        // - there are no other levels below this level OR
        // - this event doesn't overlap with any event below this level
        if (
          !segment.event.isChecklistItem ||
          levelIndex === levels.length - 1 ||
          levels
            .slice(levelIndex)
            .every((level) => !segOverlaps(segment, level))
        ) {
          break;
        }
      }
    }
    if (levelIndex >= maxLevels) {
      extra.push(segment);
    } else {
      if (!levels[levelIndex]) {
        levels[levelIndex] = [];
      }
      if (
        !previewSegmentUsed &&
        previewSegment &&
        previewSegment.event.data.id === segment.event.data.id
      ) {
        const { start, end } = previewSegment.event;
        // If we're resized the event so that it no longer
        // shows on this week, then set the slotsSpanned to 0
        if (!isInRange({ start, end }, range[0], range[6])) {
          levels[levelIndex].push({ ...segment, previewSlotsSpanned: 0 });
        } else {
          const {
            continuesAfter,
            continuesBefore,
            leftSlot,
            slotsSpanned,
          } = previewSegment;
          levels[levelIndex].push({
            ...segment,
            previewSlotsSpanned: slotsSpanned,
            previewLeftSlot: leftSlot,
            previewContinuesBefore: continuesBefore,
            previewContinuesAfter: continuesAfter,
          });
        }
        previewSegmentUsed = true;
      } else {
        levels[levelIndex].push(segment);
      }
    }
  });

  levels.forEach((level) => level.sort((a, b) => a.leftSlot - b.leftSlot));

  if (!previewSegmentUsed && previewSegment) {
    if (!levels[0]) {
      levels[0] = [];
    }
    levels[0].push(previewSegment);
  }

  return [levels, extra];
};

export const numberOfDaysSpanned = (
  start: Date | Moment,
  end: Date | Moment,
) => {
  return (
    moment(end)
      .clone()
      .startOf('day')
      .diff(moment(start).clone().startOf('day'), 'days') + 1
  );
};

export const isSameDay = (dateOne: Date, dateTwo: Date) => {
  return moment(dateOne).isSame(dateTwo, 'day');
};

export const getDateAtMousePosition = (
  x: number,
  containerComponent: HTMLElement,
  dateInfo: {
    dateRangeLength: number;
    dateRangeStartTime: number;
  },
  startOfDay = false,
) => {
  const { left, width } = containerComponent.getBoundingClientRect(),
    { dateRangeLength, dateRangeStartTime } = dateInfo,
    slotWidth = width / dateRangeLength,
    slotIndex = Math.floor((x - left) / slotWidth);

  let momentDate = moment(dateRangeStartTime).add(slotIndex, 'day');

  if (startOfDay) {
    momentDate = momentDate.startOf('day');
  }

  return momentDate.toDate();
};

export const getCurrentDateSlot = (
  x: number,
  y: number,
  startOfDay = false,
) => {
  const dateRangeComponent = (document.elementsFromPoint(
    x,
    y,
  ) as HTMLElement[]).find((el) => {
    return el.dataset.dateRange;
  })!;

  if (dateRangeComponent) {
    const { dataset } = dateRangeComponent,
      {
        dateRangeStart,
        dateRangeLength,
        dateRangeAllDay,
        dateUpdateDayOnly,
        datePreventDrop,
      } = dataset;

    return {
      date: getDateAtMousePosition(
        x,
        dateRangeComponent,
        {
          dateRangeLength: +dateRangeLength!,
          dateRangeStartTime: +dateRangeStart!,
        },
        startOfDay,
      ),
      isMultiDaySlot: dateRangeAllDay === 'true',
      updateDayOnly: !!dateUpdateDayOnly,
      resetToOriginal: datePreventDrop === 'true',
    };
  }

  return { date: null, resetToOriginal: true };
};

export const getCurrentDateSlotBeginning = (x: number, y: number) =>
  getCurrentDateSlot(x, y, true);
