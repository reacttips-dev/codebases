import type { OwaDate } from '../schema';
import timeDiff from './timeDiff';
import timeZoneOffsetDelta from './timeZoneOffsetDelta';

/**
 * Returns the number of full dates (in some scale) between two dates
 * taking time zone offset changes into account.
 * @see calendarDateDiff.
 */
export default (left: OwaDate, right: OwaDate, scale: number) => {
    const tzDelta = timeZoneOffsetDelta(left, right);
    return timeDiff(left, +right + tzDelta, scale);
};
