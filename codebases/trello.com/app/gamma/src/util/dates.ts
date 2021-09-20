/* eslint-disable @trello/disallow-filenames */
import { forNamespace } from '@trello/i18n';
import { relativeInforForStartDate } from 'app/scripts/views/internal/due-date-helpers';
import { formatHumanDate } from '@trello/dates';

import moment from 'moment';
const format = forNamespace();

/**
 * This should be moved over to the @trello/dates package, but it currently
 * depends on i18n functionality (which is in this @trello/app package). If/
 * when we move i18n to it's own package, move this function to the dates
 * package.
 */
export const getDateDeltaString = (
  date: Date,
  now: Date,
): 'just now' | string => {
  const dateObj = moment(date);
  const nowObj = moment(now);

  if (dateObj.isSame(nowObj, 'day')) {
    if (Math.abs(nowObj.diff(date, 'seconds')) < 10) {
      return format('just now');
    } else {
      return dateObj.from(now);
    }
  } else {
    return dateObj.calendar(now);
  }
};

export const getStringForCombinedDateBadge = (
  start?: Date | null,
  due?: Date | null,
  dateFormatter?: (date: Date) => string,
): string => {
  if (!dateFormatter) {
    dateFormatter = formatHumanDate;
  }
  if (start && due && start <= due) {
    return `${dateFormatter(start)} - ${dateFormatter(due)}`;
  } else if (due) {
    return `${dateFormatter(due)}`;
  } else if (start) {
    const relativeInfo = relativeInforForStartDate(start);
    let stringKey;

    if (relativeInfo === 'badge.start.past') {
      stringKey = ['badge', 'start', 'past'];
    } else {
      stringKey = ['badge', 'start', 'future'];
    }

    return format(stringKey, {
      date: dateFormatter(start),
    });
  }
  return '';
};
