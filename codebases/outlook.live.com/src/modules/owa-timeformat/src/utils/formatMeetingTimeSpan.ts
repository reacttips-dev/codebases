import formatNonRecurringTimeSpan from './formatNonRecurringTimeSpan';
import formatRecurrenceTimeSpan from './formatRecurrenceTimeSpan';
import type RecurrenceType from 'owa-service/lib/contract/RecurrenceType';
import { OwaDate, userDate, owaDate } from 'owa-datetime';

/**
 * Formats a meeting time zone.
 * When dates are given as strings they are parsed to the user's time zone.
 * When dates are given as OwaDate, the end time is normalized to the start time time zone.
 * To show as all-day event, the start and end dates must be at midnight in the start time zone.
 */
export default function formatMeetingTimeSpan(
    start: string | OwaDate | null | undefined,
    end: string | OwaDate | null | undefined,
    recurrence?: RecurrenceType,
    isShortString?: boolean
): string {
    if (!start || !end) {
        return '';
    }

    const startDate = typeof start === 'string' ? userDate(start) : start;
    const endDate = owaDate(startDate, end);

    if (recurrence) {
        return formatRecurrenceTimeSpan(startDate, endDate, recurrence, isShortString);
    } else {
        return formatNonRecurringTimeSpan(startDate, endDate, isShortString);
    }
}
