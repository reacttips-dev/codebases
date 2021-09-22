import { DateRange, dateRangesOverlap } from 'owa-datetime-utils';
import type { CacheLockInfo } from '../schema/CacheLockInfo';

export type LockEvents = { [eventKey: string]: true };
export type LockInfoEntry = [string, CacheLockInfo];
export type LockInfoEntryFilter = (lockInfoEntry: LockInfoEntry) => boolean;

/** aggregate events from lockInfoEntries
 * @param lockInfoEntryFilter function to determine if a lockInfoEntry's events should be added
 * @returns events that satisfy lockInfoEntryFilter/ all events if lockInfoEntryFilter not supplied
 */
export function aggEvents(lockInfoEntryFilter: LockInfoEntryFilter = () => true) {
    return (agg: LockEvents, [key, lockInfo]: LockInfoEntry): LockEvents => {
        if (lockInfoEntryFilter([key, lockInfo])) {
            // For all the events locked by the lock add it to the map
            Object.keys(lockInfo.lockedEvents).forEach(eventId => (agg[eventId] = true));
        }
        return agg;
    };
}

/** aggregate non-null DateRanges from lockInfoEntries
 * @param lockInfoEntryFilter function to determine if a lockInfoEntry's date range should be added
 * @returns DateRanges satisfy lockInfoEntryFilter/ all non-null DateRanges if lockInfoEntryFilter not supplied
 */
export function aggDateRanges(lockInfoEntryFilter: LockInfoEntryFilter = () => true) {
    return (agg: DateRange[], [key, lockInfo]: LockInfoEntry): DateRange[] => {
        if (lockInfoEntryFilter([key, lockInfo]) && lockInfo.lockedDateRange) {
            agg.push(lockInfo.lockedDateRange);
        }
        return agg;
    };
}

/**
 * aggregate lockIds from lockInfoEntries
 * @param lockInfoEntryFilter function to determine if a lockInfoEntry's lockId should be added
 * @returns lockIds that satisfy lockInfoEntryFilter
 */
export function aggLockIds(lockInfoEntryFilter: LockInfoEntryFilter = () => true) {
    return (agg: string[], [key, lockInfo]: LockInfoEntry): string[] => {
        if (lockInfoEntryFilter([key, lockInfo])) {
            agg.push(key);
        }
        return agg;
    };
}

export function hasOverlappingDateRange(dateRange: DateRange) {
    return ([key, lockInfo]: LockInfoEntry): boolean => {
        return (
            lockInfo.lockedDateRange &&
            dateRangesOverlap(lockInfo.lockedDateRange, dateRange, false) === 0
        );
    };
}

export const notInLock = (lockId: string) => ([key]: LockInfoEntry) => {
    return key !== lockId;
};
