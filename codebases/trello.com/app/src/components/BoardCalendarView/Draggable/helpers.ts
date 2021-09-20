/* eslint-disable @trello/export-matches-filename */
import moment from 'moment';

import { SelectedEventData } from './types';

export const getUpdatedDateRange = (
  currentSlot: Date,
  originalSlot: Date,
  eventData: SelectedEventData,
  options: {
    shouldNotReturnRange?: boolean;
    useCurrentAsEndDate?: boolean;
    addDaysToStart?: boolean;
    addDaysToEnd?: boolean;
    updateDayOnly?: boolean;
  } = {},
) => {
  if (options.shouldNotReturnRange) {
    return { start: null, end: null };
  }

  if (
    eventData.start === null &&
    eventData.end === null &&
    eventData.duration
  ) {
    const eventStart = moment(currentSlot);
    const eventEnd = eventStart.clone().add(eventData.duration, 'days');
    return {
      start: eventStart.toDate(),
      end: eventEnd.toDate(),
    };
  }

  if (
    currentSlot &&
    originalSlot &&
    currentSlot.getTime() === originalSlot.getTime() &&
    !options.useCurrentAsEndDate
  ) {
    return {
      start: eventData.start,
      end: eventData.end,
    };
  }

  const eventStartMoment = moment(eventData.start || ''),
    eventEndMoment = moment(eventData.end || ''),
    eventLength = eventEndMoment.diff(eventStartMoment, 'minutes'),
    currentSlotMoment = moment(currentSlot);

  if (options.useCurrentAsEndDate) {
    return {
      start: currentSlotMoment.clone().add(-eventLength, 'minutes').toDate(),
      end: currentSlot,
    };
  }

  const originalSlotMoment = moment(originalSlot),
    slotDiff = currentSlotMoment.diff(originalSlotMoment, 'minutes');

  if (options.addDaysToStart) {
    return {
      start: moment
        .min(eventStartMoment.clone().add(slotDiff, 'minutes'), eventEndMoment)
        .toDate(),
      end: eventData.end,
    };
  }

  if (options.addDaysToEnd) {
    return {
      start: eventData.start,
      end: moment
        .max(eventEndMoment.clone().add(slotDiff, 'minutes'), eventStartMoment)
        .toDate(),
    };
  }

  const diff = eventStartMoment.diff(originalSlotMoment, 'minutes');

  if (options.updateDayOnly) {
    const updatedEnd = eventEndMoment.clone();
    updatedEnd.date(currentSlotMoment.date());
    updatedEnd.month(currentSlotMoment.month());
    updatedEnd.year(currentSlotMoment.year());

    return {
      start: updatedEnd.clone().add(-eventLength, 'minutes').toDate(),
      end: updatedEnd.toDate(),
    };
  }

  const highlightedDateStart = currentSlotMoment.clone().add(diff, 'minutes'),
    highlightedDateEnd = highlightedDateStart
      .clone()
      .add(eventLength, 'minutes');

  return {
    start: highlightedDateStart.toDate(),
    end: highlightedDateEnd.toDate(),
  };
};

export const constructDate = (timeToKeep: Date, dateToKeep: Date) => {
  const timeMoment = moment(timeToKeep);
  const dateMoment = moment(dateToKeep);

  timeMoment.date(dateMoment.date());
  timeMoment.month(dateMoment.month());
  timeMoment.year(dateMoment.year());

  return timeMoment.toDate();
};

export const isClick = (
  currentX: number,
  currentY: number,
  initialX: number,
  initialY: number,
) => {
  const clickTolerance = 3;

  return (
    Math.abs(currentX - initialX) <= clickTolerance &&
    Math.abs(currentY - initialY) <= clickTolerance
  );
};
