import { Moment } from 'moment';

import user from 'js/lib/user';
import URI from 'jsuri';

import { momentWithUserTimezone, formatDateTimeDisplay, TIME_ONLY_CONDENSED } from 'js/utils/DateTimeUtils';

import { DayOfWeek } from './constants';

export type CalendarType = 'gcal' | 'ics';

export type CalendarArgs = {
  calendarType: CalendarType;
  courseId: string;
  selectedDays: DayOfWeek[];
  startTime: Moment;
  endTime: Moment;
};

export const getInitialStartTime = () => {
  const start = momentWithUserTimezone();
  const remainder = 30 - (start.minute() % 30);
  return momentWithUserTimezone(start).add(remainder, 'minutes');
};

export const getCalendarURL = ({ calendarType, courseId, selectedDays, startTime, endTime }: CalendarArgs) => {
  const { id: userId } = user.get();

  if (!startTime || !endTime || selectedDays.length === 0) {
    return undefined;
  }

  const daysOfWeek = selectedDays.map((day) => day.toLowerCase());

  const formattedStartTime = formatDateTimeDisplay(startTime, TIME_ONLY_CONDENSED, null, 'en');

  const formattedEndTime = formatDateTimeDisplay(endTime, TIME_ONLY_CONDENSED, null, 'en');

  const endpoint =
    calendarType === 'gcal'
      ? `studyPlans.v1?q=gCal&courseId=${courseId}`
      : `studyPlans.v1/calendar/studyplans.ics?courseId=${courseId}`;

  const url = new URI(`https://api.coursera.org/api/${endpoint}`);

  url.addQueryParam('startTime', formattedStartTime);
  url.addQueryParam('endTime', formattedEndTime);
  url.addQueryParam('daysOfWeek', daysOfWeek.toString());
  url.addQueryParam('userId', userId);

  return url.toString();
};
