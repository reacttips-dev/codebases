import type { CalendarEventEntity } from '../store/schema/CalendarEventEntity';
import { getStore } from '../store/store';
import { DateRange, getDateRangeLength } from 'owa-datetime-utils';
import {
    aggDateRanges,
    aggEvents,
    aggLockIds,
    EventsCacheLockId,
    hasOverlappingDateRange,
    LockEvents,
} from 'owa-events-cache';

export function getEventsCacheLockInfo(lockId: EventsCacheLockId, folderId: string) {
    const store = getStore();
    const cache = store.calendarFolderEvents.get(folderId);
    return cache ? cache.locksInfo.get(lockId) : null;
}

export function getAllLockedDateRanges(folderId: string): DateRange[] {
    const cache = getEventsCache(folderId);
    return cache ? [...cache.locksInfo.entries()].reduce(aggDateRanges(), []) : [];
}

/**
 * Gets all events across all locks in the cache for the given folderId
 * @param folderId
 */
export function getAllLockedEvents(folderId: string): LockEvents {
    const cache = getEventsCache(folderId);
    return cache ? [...cache.locksInfo.entries()].reduce(aggEvents(), {}) : {};
}

/**
 * Gets all the lockIds that have a particular date range/ folderId locked.
 * Returns all lock Ids that have some or all of the date range locked for the given folderId.
 * @param folderId folder Id
 * @param dateRange date range
 */
export function getAllLockIds(folderId: string, dateRange: DateRange): string[] {
    const cache = getEventsCache(folderId);
    if (!cache) {
        return [];
    }
    return [...cache.locksInfo.entries()].reduce(
        aggLockIds(hasOverlappingDateRange(dateRange)),
        []
    );
}

export function getAllFolderIdsLoadedInEventsCache(): string[] {
    const store = getStore();

    return [...store.calendarFolderEvents.keys()];
}

export function getEventsCache(folderId: string) {
    const store = getStore();
    const cache = store.calendarFolderEvents.get(folderId);
    return cache || null;
}

export function getAllCalendarEvents(
    folderId: string
): ReadonlyArray<Readonly<CalendarEventEntity>> {
    const cache = getEventsCache(folderId);

    // We mark the array and array items as readonly so that it can't be manipulated from outside
    // This enforces the correct access semantics at compile-time without the run-time cost of cloning the array
    return cache?.events ? [...cache.events.values()] : [];
}

export function isEventsCacheInitialized(folderId: string) {
    return !!getEventsCache(folderId);
}

export function getLongestLockedDateRange(folderId: string) {
    const lockedDateRanges = getAllLockedDateRanges(folderId);
    if (lockedDateRanges && lockedDateRanges.length > 0) {
        return lockedDateRanges.sort((a, b) => {
            // sort the ranges in descending order
            const length_a = getDateRangeLength(a);
            const length_b = getDateRangeLength(b);
            return length_a > length_b ? -1 : length_a < length_b ? 1 : 0;
        })[0];
    }
    return null;
}
