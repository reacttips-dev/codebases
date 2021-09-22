import { LINKEDCALENDAR_ENTRY_TYPENAME } from './constants';

/**
 * Returns whether provided calendar is a old model shared calendar or not
 * @param calendarEntry, the calendar entry
 * @returns true if calendar is an old model shared calendar
 */
export function isOldModelSharedCalendar(calendarEntry: {
    __typename?: string;
    IsGroupMailboxCalendar?: boolean;
}): boolean {
    return (
        calendarEntry?.__typename == LINKEDCALENDAR_ENTRY_TYPENAME &&
        !calendarEntry?.IsGroupMailboxCalendar
    );
}
