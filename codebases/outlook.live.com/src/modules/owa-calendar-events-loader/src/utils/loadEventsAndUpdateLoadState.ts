import type { DateRange } from 'owa-datetime-utils';
import type { EventsCacheLockId } from 'owa-calendar-events-store';
import { loadEvents } from './loadEvents';
import { getFolderIdByCalendarID, canFetchEvents } from '../selectors/calendarCacheSelectors';
import { updateLoadState } from '../actions/internalActions';
/**
 * Loads events from calendars for the date and updates the overall load
 * state of the scenario based on the current cached events.
 * @param calendarIds calendarIds to try to load events for
 * @param dateRange date range to load
 * @param eventsCacheLockId eventsCacheLockId
 */
export async function loadEventsAndUpdateLoadState(
    eventsCacheLockId: EventsCacheLockId,
    calendarIds: string[],
    dateRange: DateRange
) {
    const calendarIdsToFetch = calendarIds.filter(canFetchEvents);
    if (calendarIdsToFetch.length > 0) {
        const folderIds = calendarIdsToFetch.map(getFolderIdByCalendarID);
        const { canFetchAllEventsFromLocal, fetchPromise } = loadEvents(
            folderIds,
            dateRange,
            eventsCacheLockId
        );
        if (!canFetchAllEventsFromLocal) {
            updateLoadState('Fetching', eventsCacheLockId);
        }
        await fetchPromise;
    }
}
