import { getCalendarEntryByFolderId } from 'owa-calendar-cache';

/**
 * Gets calendar charm scheme by folder id
 * @returns the charm for the calendar
 */
export function getCalendarCharmIdByFolderId(calendarFolderId: string): number {
    let calendarEntry = getCalendarEntryByFolderId(calendarFolderId);
    if (calendarEntry) {
        return calendarEntry.CharmId;
    } else {
        return null;
    }
}
