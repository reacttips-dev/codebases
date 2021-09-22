import {
    formatShortTime,
    formatShortUserDate,
    isSameDay,
    OwaDate,
    startOfDay,
    userDate,
} from 'owa-datetime';
import { observableToday } from './selectors';

export default function formatShortRelativeDate(date: OwaDate | string | null | undefined) {
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
        return formatShortTime;
    }

    return formatShortUserDate;
}
