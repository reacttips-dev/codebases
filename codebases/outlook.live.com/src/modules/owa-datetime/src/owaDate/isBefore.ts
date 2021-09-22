import type { OwaDate } from '../schema';

/**
 * Compares two dates by their UTC timestamps.
 *
 * @returns true if left < right, false otherwise.
 */
export default (left: OwaDate, right: OwaDate) => +left < +right;
