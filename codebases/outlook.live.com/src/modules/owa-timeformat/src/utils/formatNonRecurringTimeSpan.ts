import { OwaDate, owaDate, isAllDayEvent, isSameDay, differenceInDays } from 'owa-datetime';
import {
    formatOneDayAllDayTimeSpan,
    formatMultiDayAllDayTimeSpan,
    formatSingleDayTimeSpan,
    formatMultiDayTimeSpan,
} from './formatTimeSpan';

export default function formatNonRecurringTimeSpan(
    startDate: OwaDate,
    endDate: OwaDate,
    isShortString: boolean
): string {
    const end = owaDate(startDate, endDate);
    if (isAllDayEvent(startDate, end)) {
        if (differenceInDays(startDate, end) === -1) {
            return formatOneDayAllDayTimeSpan(startDate, end, isShortString);
        } else {
            return formatMultiDayAllDayTimeSpan(startDate, end, isShortString);
        }
    } else if (isSameDay(startDate, end)) {
        return formatSingleDayTimeSpan(startDate, end, isShortString);
    } else {
        return formatMultiDayTimeSpan(startDate, end, isShortString);
    }
}
