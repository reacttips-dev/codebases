// These are the two kosher Date calls we allow in OWA and we
// export them as functions in owa-datetime to reduce `Date` usage.

/**
 * Returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
 */
export const timestamp: (this: void) => number = () => Date.now();

/**
 * Returns the current time in ISO format (ISO 8601), which is always 24 or 27
 * characters long (YYYY-MM-DDTHH:mm:ss.sssZ or ±YYYYYY-MM-DDTHH:mm:ss.sssZ, respectively).
 * The timezone is always zero UTC offset, as denoted by the suffix "Z".
 */
export const isoTimestamp: (this: void) => string = () => new Date().toISOString();
