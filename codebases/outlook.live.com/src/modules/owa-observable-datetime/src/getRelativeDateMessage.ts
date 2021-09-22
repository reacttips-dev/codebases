import {
    addDays,
    formatUserTime,
    formatMonthDay,
    formatWeekDay,
    isSameDay,
    isWithinRange,
    OwaDate,
    startOfDay,
    userDate,
    formatYesterdayAtTime,
    formatDayAtTime,
} from 'owa-datetime';
import { observableToday } from './selectors';

/**
 * A utility function that creates a relative dateTime string using the OwaDate.
 * For example the output is in the format of
 * 8:30 AM (if the date is of today)
 * Yesterday at 5:00 PM ( if the date is 1 day ago )
 * Saturday at 3:00 PM ( if the date is in the last week)
 * August 5 at 3:00 PM ( for any date beyond a week )
 * @param date a value that provides the UTC date to get the relative date
 */

export default function getRelativeDateMessage(date: OwaDate | string | null | undefined) {
    if (!date) {
        return '';
    }

    const dateInUserTz = userDate(date);
    return getRelativeDateFormatter(dateInUserTz, observableToday());
}

function getRelativeDateFormatter(date: OwaDate, today: OwaDate) {
    const day = startOfDay(date);

    if (isSameDay(day, today)) {
        return formatUserTime(date);
    } else if (isDayInLastNDays(day, today, 2)) {
        return formatYesterdayAtTime(date);
    } else if (isDayInLastNDays(day, today, 7)) {
        return formatDayAtTime(formatWeekDay(date), formatUserTime(date));
    } else {
        return formatDayAtTime(formatMonthDay(date), formatUserTime(date));
    }
}

function isDayInLastNDays(day: OwaDate, today: OwaDate, n: number) {
    return isWithinRange(day, addDays(today, -n), today);
}
