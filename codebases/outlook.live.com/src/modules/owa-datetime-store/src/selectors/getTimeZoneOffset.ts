import { getStore } from '../store';
import type { TimeZoneRange } from '../TimeZoneRange';
import cleanTimeZoneId from './cleanTimeZoneId';

/**
 * Find the offset of the given time, in the given time zone.
 *
 * @param date The date to lookup.
 * @param timeZone Time zone to search. Defaults to the user's primary time zone.
 * @param localDate `true` if the date is a local to the respective time zone. Defaults to `false`.
 *
 * NOTE: OWA returns negative numbers for timezones that are behind UTC. Ex: PST is -480.
 */
export default function getTimeZoneOffset(
    date: number | Date,
    timeZone?: string,
    localDate?: boolean
): number {
    timeZone = cleanTimeZoneId(timeZone);

    // Shortcut for tests, bootstrap and min/max UTC ranges.
    if (timeZone == 'UTC') {
        return 0;
    }

    const ranges = getTimeZoneRanges(timeZone);
    const value = date.valueOf();
    const contains = localDate ? containsLocalValue : containsUtcValue;

    for (let r = 0; r < ranges.length; r++) {
        const range = ranges[r];
        if (contains(range, value)) {
            return range.offset;
        }
    }

    throw new Error(
        `Offset not found for ${date.toString()} in time zone ${timeZone}. ` +
            `Ranges: ${JSON.stringify(ranges)}`
    );
}

function containsUtcValue(range: TimeZoneRange, value: number) {
    return value >= range.start && value < range.end;
}

function containsLocalValue(range: TimeZoneRange, localValue: number) {
    return localValue >= range.localStart && localValue < range.localEnd;
}

function getTimeZoneRanges(timeZone: string) {
    const store = getStore();
    const ranges = store.TimeZoneRanges[timeZone];
    if (!ranges) {
        throw new Error(`Time zone '${timeZone}' is not available.`);
    }
    return ranges;
}
