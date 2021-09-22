import { getLockedCalendarEventsStore } from '../selectors/calendarEventsLockedStoreSelectors';
import { getEventLockCacheId } from '../selectors/calendarEventsLoaderStoreSelectors';
import { trace } from 'owa-trace';
import type { DateRange } from 'owa-datetime-utils';
import type { EventsCacheLockId } from 'owa-calendar-events-store';

export const loadEvents = (
    folderIds: string[],
    dateRange: DateRange,
    eventsCacheLockId: EventsCacheLockId
): { canFetchAllEventsFromLocal: boolean; fetchPromise: Promise<void> } => {
    // TODO VSO 61683: Investigate fetchCalendarEventsForDateRange getting called with null date range
    if (!folderIds || folderIds.length === 0 || dateRange === null) {
        return {
            canFetchAllEventsFromLocal: false,
            fetchPromise: new Promise<void>(async resolve => resolve()),
        };
    }
    return fetchPromise(folderIds, dateRange, eventsCacheLockId);
};

function fetchPromise(
    folderIds: string[],
    dateRange: DateRange,
    eventsCacheLockId: EventsCacheLockId
): { canFetchAllEventsFromLocal: boolean; fetchPromise: Promise<void> } {
    const lockId = getEventLockCacheId(eventsCacheLockId);
    const lockStore = getLockedCalendarEventsStore(lockId);
    const results = folderIds.map(folderId =>
        lockStore.fetchCalendarEventsForDateRange(folderId, dateRange)
    );
    const canFetchAllEventsFromLocal = results.every(r => r.events !== null);
    const fetchPromise = new Promise<void>(async resolve => {
        try {
            await Promise.all(results.map(r => r.fetchPromise));
            folderIds.forEach(folderId => lockStore.subscribeNotifications(folderId));
        } catch (error) {
            trace.warn('loadEvents: Exception occured: ' + error.message);
        }
        resolve();
    });
    return {
        canFetchAllEventsFromLocal: canFetchAllEventsFromLocal,
        fetchPromise: fetchPromise,
    };
}
