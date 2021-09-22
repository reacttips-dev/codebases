import {
    getYear,
    getMonth,
    getDate,
    getHours,
    getMinutes,
    getSeconds,
    getMilliseconds,
} from './getFields';
import { owaDate } from './owaDate';
import type { OwaDate } from '../schema';

/**
 * Creates a new date, based on the given date and time.
 * Time gets normalized to the date's time zone.
 */
export default function mergeDateAndTime(date: OwaDate, time: OwaDate) {
    const timeInDateTz = owaDate(date, time);
    return owaDate(
        date.tz,
        getYear(date),
        getMonth(date),
        getDate(date),
        getHours(timeInDateTz),
        getMinutes(timeInDateTz),
        getSeconds(timeInDateTz),
        getMilliseconds(timeInDateTz)
    );
}
