import type { CalendarEvent } from 'owa-calendar-types';
import type { LocalCalendarEntry } from 'owa-graph-schema';
import { getCalendarEntryByFolderId } from 'owa-calendar-cache';
import { isLinkedCalendarEntry } from 'owa-calendar-properties';

/**
 * Gets whether the current item is on someone else's calendar
 * @param item calendar item object
 */
export default function isMeetingOnCalendarSharedWithMe(item: CalendarEvent): boolean {
    if (item) {
        const calendarEntry = getCalendarEntryByFolderId(item.ParentFolderId.Id);
        if (calendarEntry) {
            return (
                (calendarEntry as LocalCalendarEntry).IsSharedWithMe ||
                isLinkedCalendarEntry(calendarEntry)
            );
        }
    }
    return false;
}
