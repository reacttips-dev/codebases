import type { OwaDate } from '../schema';

/**
 * Compares two dates by their UTC timestamps.
 * VSO 43183: fix compare is coercing null values to a zero timestamp
 * @returns -1 if left < right, 1 if left > right and 0 if left == right.
 */
export default (left: OwaDate, right: OwaDate) => {
    const d = +left - +right;
    return d ? d / Math.abs(d) : 0;
};
