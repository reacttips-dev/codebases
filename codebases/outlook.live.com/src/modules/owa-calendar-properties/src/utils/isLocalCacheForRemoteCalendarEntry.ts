import { LOCALCACHEFORREMOTECALENDAR_ENTRY_TYPENAME } from './constants';

/**
 * Returns whether provided calendar entry is for LocalCacheForRemoteCalendarEntry calendar
 * @param calendarEntry, the calendar entry
 * @returns true if calendar entry is for isLocalCacheForRemoteCalendarEntry calendar
 */
export function isLocalCacheForRemoteCalendarEntry(calendarEntry: {
    __typename?: string;
    CalendarName?: string;
}): boolean {
    return calendarEntry?.__typename == LOCALCACHEFORREMOTECALENDAR_ENTRY_TYPENAME;
}
