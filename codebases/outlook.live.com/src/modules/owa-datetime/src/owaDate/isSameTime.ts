import { owaDate } from './owaDate';
import type { OwaDate } from '../schema';
import { getMinutes, getHours } from './getFields';

/**
 * Returns true if two dates, normalized to the same time zone, have same time, ignoring the date.
 */
export default (a: OwaDate, b: OwaDate) => isSameRawTime(a, owaDate(a, b));

const isSameRawTime = (a: OwaDate, b: OwaDate) =>
    getMinutes(a) == getMinutes(b) && getHours(a) == getHours(b);
