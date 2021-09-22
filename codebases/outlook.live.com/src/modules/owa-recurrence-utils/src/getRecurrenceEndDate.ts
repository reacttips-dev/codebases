import type EndDateRecurrence from 'owa-service/lib/contract/EndDateRecurrence';
import type RecurrenceType from 'owa-service/lib/contract/RecurrenceType';
import { OwaDate, owaDate } from 'owa-datetime';

export default function getRecurrenceEndDate(
    timeZoneId: string,
    recurrence: RecurrenceType
): OwaDate {
    if (recurrence?.RecurrenceRange) {
        const endDateString = (recurrence.RecurrenceRange as EndDateRecurrence).EndDate;
        if (endDateString) {
            return owaDate(timeZoneId, endDateString);
        }
    }

    return null;
}
