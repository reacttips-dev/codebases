import { getISOStringWithOffset, owaDate, startOfDay } from 'owa-datetime';
import type CalendarEvent from '../types/CalendarEvent';

/**
 * Returns the strings that represents the default time for the recurrence start of an event.
 * The recurrence start must take into account the time zone of the event.
 */
export default function getDefaultRecurrenceStart({
    StartTimeZoneId,
    Start,
}: Pick<CalendarEvent, 'Start' | 'StartTimeZoneId'>) {
    const startTimeInEventTz = owaDate(StartTimeZoneId, Start);
    const startOfDayInEventTz = startOfDay(startTimeInEventTz);
    return getISOStringWithOffset(startOfDayInEventTz);
}
