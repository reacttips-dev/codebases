import type DayOfWeekType from '../../../store/schema/DayOfWeekType';

// The index of each day in this array is the same as the value returned by
//   Date.prototype.getDay() for the given day of the week
const DAYS_OF_WEEK: DayOfWeekType[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

/**
 * Returns the 0-based index of the provided day in the week, as used by the ECMAScript Date object.
 * @param day The string representation of a day of the week
 */
export default function getDayOfWeekIndex(day: DayOfWeekType) {
    return DAYS_OF_WEEK.indexOf(day);
}
