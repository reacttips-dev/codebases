import { createRemovePredicateByFolderId } from './createRemovePredicateByFolderId';
import { calendarEventsRemovedMatchingFilter } from '../actions/publicActions';
import { getEventsCache } from '../selectors/eventsCacheSelectors';

/**
 * DO NOT USE ANYWHERE ELSE -- REMOVE AFTER VSO #30430
 *
 * There are scenarios where the cache may have silently evicted some unneeded items
 * (outside of manual evictions managed by `owa-calendar-events-store`), so we also need to fire a
 * public action to allow the surface store to clean up any "dangling" events that have been removed from
 * the cache since the last time a "sync" operation was triggered.
 *
 * This is a superset of standard surface store sync that ensures the store is 100% in-sync with cache removals.
 *
 * TODO: VSO #30430 Once the legacy surface-syncing architecture is removed in favor of the modern selector-based
 * approach, this util and associated code should be deleted.
 */
export function syncSurfaceStoreWithCache(folderId: string) {
    const eventsCache = getEventsCache(folderId);
    const eventsInCacheForFolder = eventsCache ? [...eventsCache.events.values()] : [];
    calendarEventsRemovedMatchingFilter(
        createRemovePredicateByFolderId(folderId, eventsInCacheForFolder, false)
    );
}
