// Export functions that mutate the cache
export { addEventForLock } from './command/addEventForLock';
export { addEventsInDateRangeForLock } from './command/addEventsInDateRangeForLock';
export { upsertEvents } from './command/upsertEvents';
export { replaceEvents } from './command/replaceEvents';
export { evictEventsWithKeysForLock } from './command/evictEventsWithKeysForLock';
export { evictEventsExceptInDateRangeForLock } from './command/evictEventsExceptInDateRangeForLock';
export { removeEvents } from './command/removeEvents';
export { releaseLock } from './command/releaseLock';

// Export functions that mutate the event
export { updateEventProperties } from './command/updateEventProperties';

// Export function that retrieve data from cache
export { getEventsInDateRangeFromLock } from './query/getEventsInDateRangeFromLock';
export { getEventsFromCache } from './query/getEventsFromCache';
export { getEventsWithKeysFromLock } from './query/getEventsWithKeysFromLock';

// Export util functions
export { createEventsCacheLockId } from './utils/createEventsCacheLockId';
export { createEventsCache } from './utils/createEventsCache';
export {
    aggDateRanges,
    aggEvents,
    aggLockIds,
    hasOverlappingDateRange,
} from './utils/lockInfoEntryUtils';
export type { LockEvents } from './utils/lockInfoEntryUtils';

// Export types
export type { EventsCacheLockId } from './schema/EventsCache';
export type { EventsCache } from './schema/EventsCache';
export type { EventEntity } from './schema/EventEntity';
export type { CacheLockInfo } from './schema/CacheLockInfo';
