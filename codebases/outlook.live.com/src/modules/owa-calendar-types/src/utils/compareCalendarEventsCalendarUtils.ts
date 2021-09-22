import {
    getCalendarEntryByFolderId,
    getDefaultCalendar,
    getCalculatedFolderIdForDefaultCalendar,
} from 'owa-calendar-cache';

import type CalendarEvent from '../types/CalendarEvent';

/**
 * Checks whether the item belongs to a primary calendar. Currently this only
 * compares to the default calendar id, but OneView will have this compare to all
 * primary calendars
 */
export function isPrimaryCalendar(item: CalendarEvent): boolean {
    // item.ParentFolderId can be null if the item is a local lie or fake compose item
    return (
        item.ParentFolderId && item.ParentFolderId.Id === getCalculatedFolderIdForDefaultCalendar()
    );
}

/**
 * Checks whether the item is in the Calendars calendar group (primary, secondary, interesting/holiday)
 * Currently this only checks the default calendar group but will eventually include OneView groups as well
 * @param item
 */
export function isOwnedCalendar(item: CalendarEvent): boolean {
    // item.ParentFolderId can be null if the item is a local lie or fake compose item
    if (!item.ParentFolderId) {
        return false;
    }

    const defaulCalendarEntry = getDefaultCalendar();
    const calendarEntry = getCalendarEntryByFolderId(item.ParentFolderId.Id);
    return calendarEntry?.ParentGroupId === defaulCalendarEntry?.ParentGroupId;
}
