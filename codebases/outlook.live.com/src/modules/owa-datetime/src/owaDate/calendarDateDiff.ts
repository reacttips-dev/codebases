import type { OwaDate } from '../schema';
import timeZoneOffsetDelta from './timeZoneOffsetDelta';

/**
 * Returns the number of full dates (in some scale) between two dates,
 * taking time zone offset changes into account and rounding the result
 * to account for daylight savings changes.
 *
 * @see fullDateDiff
 */
export default (left: OwaDate, right: OwaDate, scale: number) => {
    const tzDelta = timeZoneOffsetDelta(left, right);
    const diff = +left - +right - tzDelta;
    return Math.round(diff / scale);
};
