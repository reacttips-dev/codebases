import {
  DAY_SECS,
  HR_SECS,
  MONTH_SECS,
  WEEK_SECS,
  YEAR_SECS,
} from './constants';
import { DateRange, DateRangeLabel, Order, TimeInterval } from './types';

const sortObjectArrayByDate = <T>(
  objArray: T[],
  order: Order,
  getDateFn: (obj: T) => Date
) =>
  objArray.sort((a: T, b: T) => {
    switch (order) {
      case 'desc':
        return (
          new Date(getDateFn(b)).getTime() - new Date(getDateFn(a)).getTime()
        );
      case 'asc':
        return (
          new Date(getDateFn(a)).getTime() - new Date(getDateFn(b)).getTime()
        );
      default:
        const exhaustiveCheck: never = order;
        return exhaustiveCheck;
    }
  });

function getWeekRange(date?: Date) {
  const dateCopy = date ? new Date(date) : new Date();
  const currentDayOfTheMonth = dateCopy.getDate();
  const currentDayOfTheWeek = dateCopy.getDay();
  const daysArray = Array(7).fill(null);
  const dayOfTheWeek = new Date(
    dateCopy.setDate(currentDayOfTheMonth - currentDayOfTheWeek)
  );
  const weekRange = daysArray.map((day, index) => {
    const increment = index === 0 ? 0 : 1;
    const newDate = new Date(
      dayOfTheWeek.setDate(dayOfTheWeek.getDate() + increment)
    );
    if (index === 0) newDate.setHours(0, 0, 0, 0);
    if (index === 6) {
      newDate.setHours(23, 59, 59, 999);
    }
    return newDate;
  });
  return weekRange;
}

function getNewDateFromOffset(currentDate: Date, offsetByDays: number) {
  // 86400000 === 1 day
  return new Date(currentDate.getTime() + offsetByDays * 86400000);
}

function getSecondsInTimeInterval(timeInterval: TimeInterval): number {
  switch (timeInterval) {
    case 'hour':
      return HR_SECS;
    case 'day':
      return DAY_SECS;
    case 'week':
      return WEEK_SECS;
    case 'month':
      return MONTH_SECS;
    case 'year':
      return YEAR_SECS;
  }
}

const getEpochTime = (date: Date) => Math.round(date.getTime() / 1000);

const getDateFromEpochTime = (epochTime: number) =>
  new Date(new Date(0).setUTCSeconds(epochTime));

const getDateInTheFuture = (
  startingDate: Date,
  dayCountInTheFuture: number
) => {
  const date = new Date(startingDate.getTime());
  date.setDate(date.getDate() + dayCountInTheFuture);
  return date;
};

const getDateInThePast = (startingDate: Date, dayCountInThePast: number) => {
  const date = new Date(startingDate.getTime());
  date.setDate(date.getDate() - dayCountInThePast);
  return date;
};

function getDateRangeFromLabel(label: DateRangeLabel): DateRange {
  const today = new Date();
  switch (label) {
    case 'Yesterday': {
      const yesterday = getNewDateFromOffset(today, -1);
      return {
        startDateRange: yesterday,
        endDateRange: yesterday,
      };
    }
    case 'Today':
      return {
        startDateRange: today,
        endDateRange: today,
      };
    case 'Last 7 days':
      return {
        startDateRange: getNewDateFromOffset(today, -6),
        endDateRange: today,
      };
    case 'Last 30 days':
      return {
        startDateRange: getNewDateFromOffset(today, -29),
        endDateRange: today,
      };
    case 'Last 90 days':
      return {
        startDateRange: getNewDateFromOffset(today, -89),
        endDateRange: today,
      };
    case 'All time':
      return { startDateRange: null, endDateRange: null };
  }
}

function getTimezoneOffsetInSeconds() {
  return new Date().getTimezoneOffset() * 60;
}

/**
 * Returns a local-equivalent timestamp that adds the timezone offset from UTC.
 * A use case is if you want to display a date in UTC, not the local timezone
 * @param timestamp
 */
function getUTCTimestamp(timestamp: number) {
  return timestamp + getTimezoneOffsetInSeconds();
}

/**
 * Returns a UTC-equivalent timestamp that subtracts the timezone offset from UTC.
 * A use case is if our API expects UTC timestamps, this will "convert" your local
 * timestamp to be the same when expecting UTC.
 * @param timestamp
 */
function getLocalTimestamp(timestamp: number) {
  return timestamp - getTimezoneOffsetInSeconds();
}

function getRoundedDay(date: Date, round: 'start' | 'end') {
  const newTimestamp =
    round === 'start'
      ? date.setHours(0, 0, 0, 0)
      : date.setHours(23, 59, 59, 999);
  return new Date(newTimestamp);
}

function getHourOffset() {
  // JS API is in minutes
  return new Date().getTimezoneOffset() / 60;
}

export {
  sortObjectArrayByDate,
  getWeekRange,
  getNewDateFromOffset,
  getSecondsInTimeInterval,
  getEpochTime,
  getDateFromEpochTime,
  getDateInTheFuture,
  getDateInThePast,
  getDateRangeFromLabel,
  getUTCTimestamp,
  getLocalTimestamp,
  getRoundedDay,
  getHourOffset,
};
