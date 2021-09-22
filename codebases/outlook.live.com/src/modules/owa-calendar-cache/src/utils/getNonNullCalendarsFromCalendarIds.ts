import { getCalendarEntryByCalendarId } from '../selectors/calendarsCacheSelectors';
import type { CalendarEntry } from 'owa-graph-schema';

export default function getNonNullCalendarsFromCalendarIds(calendarIds: string[]): CalendarEntry[] {
    return calendarIds
        ? calendarIds.map(getCalendarEntryByCalendarId).filter(calendar => !!calendar) // Make sure we remove null calendars (this happens when cache is not loaded or when the group calendars have not loaded to the cache and we don't get calendar objects from the cache)
        : null;
}
