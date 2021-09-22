import type TimeZoneRangeType from 'owa-service/lib/contract/TimeZoneRangeType';
import type { TimeZoneRange } from '../TimeZoneRange';
import {
    MIN_JAVASCRIPT_TIMESTAMP,
    MAX_JAVASCRIPT_TIMESTAMP,
    MILLISECONDS_IN_MINUTE,
} from 'owa-date-constants';

export function timeZoneRanges(
    timeZoneRanges: Required<Pick<TimeZoneRangeType, 'UtcTime' | 'Offset'>>[]
): TimeZoneRange[] {
    const ranges = timeZoneRanges.map(({ UtcTime, Offset }) => {
        const start = Date.parse(UtcTime);
        return {
            start,
            localStart: start + Offset * MILLISECONDS_IN_MINUTE,
            end: MAX_JAVASCRIPT_TIMESTAMP,
            localEnd: MAX_JAVASCRIPT_TIMESTAMP,
            offset: Offset,
        };
    });

    // Each range (except the last) ends where the next starts.
    // The localEnd needs to account for the current range having larger
    // offset than the next one, so we pick up the correct offset.
    for (var i = 0; i < ranges.length - 1; i++) {
        const range = ranges[i];
        const nextRange = ranges[i + 1];
        range.end = nextRange.start;
        range.localEnd =
            range.end + Math.max(range.offset, nextRange.offset) * MILLISECONDS_IN_MINUTE;
    }

    // Extend the first range to beginning of time.
    // NOTE: According to http://ecma-international.org/ecma-262/5.1/#sec-15.9.1.8
    // a better solution would be to find a similar year, in terms of leap and
    // starting weekday, and use the corresponding dates for daylight start/end.
    ranges[0].start = ranges[0].localStart = MIN_JAVASCRIPT_TIMESTAMP;

    return ranges;
}
