import { calendarIsInCache, calendarFolderIdNeedsUpdate } from 'owa-calendar-cache';

export function canFetchEvents(id: string): boolean {
    return calendarIsInCache(id) && !calendarFolderIdNeedsUpdate(id);
}

export function canUpdateCalendarFolderId(id: string): boolean {
    return calendarIsInCache(id) && calendarFolderIdNeedsUpdate(id);
}

export { calendarFolderIdNeedsUpdate, calendarIsInCache };
export { getAndUpdateActualFolderId } from 'owa-calendarsapi-outlook';
export { getDefaultCalendar, getFolderIdByCalendarID } from 'owa-calendar-cache';
