import { MILLISECONDS_IN_DAY } from 'owa-date-constants';
import type { OwaDate } from '../schema';
import startOfDay from './startOfDay';
import calendarDateDiff from './calendarDateDiff';

/** Returns the number of calendar days between two `OwaDate` instances. */
export default (left: OwaDate, right: OwaDate) =>
    calendarDateDiff(startOfDay(left), startOfDay(right), MILLISECONDS_IN_DAY);
