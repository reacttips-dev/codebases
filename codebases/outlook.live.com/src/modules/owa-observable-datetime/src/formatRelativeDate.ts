import {
    addDays,
    formatUserDate,
    formatUserTime,
    formatWeekDayShortUserDate,
    formatWeekDayTime,
    isSameDay,
    isWithinRange,
    OwaDate,
    startOfDay,
    userDate,
} from 'owa-datetime';
import { observableToday } from './selectors';

export default function formatRelativeDate(date: OwaDate | string | null | undefined) {
    if (!date) {
        return '';
    }

    const dateInUserTz = userDate(date);
    const formatter = getRelativeDateFormatter(dateInUserTz, observableToday());
    return formatter(dateInUserTz);
}

function getRelativeDateFormatter(date: OwaDate, today: OwaDate) {
    const day = startOfDay(date);

    if (isSameDay(day, today)) {
        return formatUserTime;
    }

    const isInLastNDays = (n: number) => isWithinRange(day, addDays(today, -n), today);

    if (isInLastNDays(3)) {
        return formatWeekDayTime;
    }

    if (isInLastNDays(30)) {
        return formatWeekDayShortUserDate;
    }

    return formatUserDate;
}
