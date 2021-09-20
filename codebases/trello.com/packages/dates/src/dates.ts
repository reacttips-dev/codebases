import moment from 'moment';

export const isDateToday = (date: Date) =>
  moment(date).isSame(Date.now(), 'day');

export const idToDate = (id: string): Date =>
  new Date(1000 * parseInt(id.substr(0, 8), 16));

export const dateToId = (date: Date) =>
  Math.floor(date.getTime() / 1000).toString(16) + '0000000000000000';

export const formatHumanDate = (date: Date) => {
  const momentDate = moment(new Date(date));
  const now = moment();

  const isAmbiguousMonth = Math.abs(now.diff(momentDate, 'months')) > 9;
  const shouldHideYear = momentDate.isSame(now, 'year') && !isAmbiguousMonth;

  return momentDate.format(shouldHideYear ? 'llll' : 'll');
};

export const dateDifferenceInDays = (
  startDate: Date,
  endDate: Date,
  asFloat?: boolean,
) => {
  const start = moment(startDate);
  const end = moment(endDate);

  return end.diff(start, 'days', asFloat);
};

export const isWeekend = (date: Date | string) => {
  const momentDate = moment(date);
  const dayOfWeekNumber = momentDate.isoWeekday();
  return dayOfWeekNumber === 6 || dayOfWeekNumber === 7;
};

export const getDateWithAddedHours = (date: Date | string, hours: number) => {
  const currentDate = new Date(date);
  currentDate.setHours(currentDate.getHours() + hours);
  return currentDate;
};

export const getDateWithAddedDays = (date: Date | string, days: number) => {
  const currentDate = new Date(date);
  currentDate.setDate(currentDate.getDate() + days);
  return currentDate;
};

export const getDateWithAddedWeeks = (date: Date | string, weeks: number) => {
  const currentDate = new Date(date);
  currentDate.setDate(currentDate.getDate() + weeks * 7);
  return currentDate;
};

export const getDateWithAddedMonths = (date: Date | string, months: number) => {
  const currentDate = new Date(date);
  currentDate.setMonth(currentDate.getMonth() + months);
  return currentDate;
};
