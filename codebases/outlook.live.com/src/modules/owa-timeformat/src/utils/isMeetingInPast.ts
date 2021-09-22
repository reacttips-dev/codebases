import { OwaDate, userDate, isBefore } from 'owa-datetime';
import type CalendarItem from 'owa-service/lib/contract/CalendarItem';
import type EndDateRecurrence from 'owa-service/lib/contract/EndDateRecurrence';
import getRecurrenceHandler from './recurrence/getRecurrenceHandler';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';
import type NumberedRecurrence from 'owa-service/lib/contract/NumberedRecurrence';

export default function isMeetingInPast(
    { End, Recurrence }: CalendarItem | MeetingRequestMessageType,
    now: OwaDate
): boolean {
    if (Recurrence) {
        const { RecurrenceRange } = Recurrence;

        const { EndDate } = <EndDateRecurrence>RecurrenceRange;
        if (EndDate) {
            const endDate = userDate(EndDate);
            return isBefore(endDate, now);
        }

        const { NumberOfOccurrences, StartDate } = <NumberedRecurrence>RecurrenceRange;
        if (NumberOfOccurrences) {
            const startDate = userDate(StartDate);
            const endDate = getRecurrenceHandler(
                Recurrence.RecurrencePattern
            ).getNumberedRecurrenceEndDate(
                Recurrence.RecurrencePattern,
                startDate,
                NumberOfOccurrences
            );

            return isBefore(endDate, now);
        }

        return false;
    }

    return isBefore(userDate(End), now);
}
