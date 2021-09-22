// Cache entry TTL. In milliseconds.
export const CACHE_ENTRY_TIME_TO_LIVE: number = 120 * 1000 * 60;

// The time interval to clear up expired entries. In milliseconds.
export const EXPIRED_ENTRY_CLEAR_UP_INTERVAL: number = 20 * 1000 * 60;

// The max allowed entry number in the cache
export const CACHE_LIMIT: number = 300;

// When the max allowed entry number is reach,
// how many old entries we should remove from cache
export const NUMBER_OF_ENTRIES_TO_REMOVE: number = 50;
