import { createEventsCacheLockId } from 'owa-events-cache';
import { getLockedCalendarEventsStore } from './getLockedCalendarEventsStore';
import type { LockedCalendarEventsStore } from '../../types/LockedCalendarEventsStore';
import { setMruListSize } from '../fullItemsMruListSize';

export interface EventCacheOptions {
    readonly maxMruSize?: number;
}

export function createLockedCalendarEventsStore(
    id?: string,
    options?: EventCacheOptions
): LockedCalendarEventsStore {
    const lockId = createEventsCacheLockId(id);

    if (options) {
        setMruListSize(lockId, options.maxMruSize);
    }

    return getLockedCalendarEventsStore(lockId);
}
