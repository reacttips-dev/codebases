import { MILLISECONDS_IN_WEEK } from 'owa-date-constants';
import type { OwaDate } from '../schema';
import startOfWeek from './startOfWeek';
import calendarDateDiff from './calendarDateDiff';

/** Returns the number of calendar weeks between two `OwaDate` instances. */
export default (left: OwaDate, right: OwaDate, weekStartsOn: number) =>
    calendarDateDiff(
        startOfWeek(left, weekStartsOn),
        startOfWeek(right, weekStartsOn),
        MILLISECONDS_IN_WEEK
    );
