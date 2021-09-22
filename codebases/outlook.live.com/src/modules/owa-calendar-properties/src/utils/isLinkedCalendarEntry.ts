import { LINKEDCALENDAR_ENTRY_TYPENAME } from './constants';

/**
 * Returns whether provided calendar entry is for linked calendar
 * @param calendarEntry, the calendar entry
 * @returns true if calendar entry is for linked calendar
 */
export function isLinkedCalendarEntry(calendarEntry: {
    __typename?: string;
    CalendarName?: string;
}): boolean {
    return calendarEntry?.__typename == LINKEDCALENDAR_ENTRY_TYPENAME;
}
