import { getYear } from '../owaDate';
import type { OwaDate } from '../schema';
import formatDate from './formatDate';

/**
 * Gets a string that represents an OwaDate in an EWS request.
 * The returned string carries the same date and time values as it is shown
 * to the end user, with the expectation that EWS requests send the user's
 * choice of TimeZoneDefinition. Milliseconds are included.
 *
 * NOTE: The time offset IS NOT included, which can lead to ambiguity when called
 * with the time in which daylight savings ends. It is better to send the full
 * ISO string to the server instead of this cut-down version.
 *
 * The only reason I don't remove this function right now is because some EWS/REST
 * calls seem to have trouble respecting a full ISO string, so we need to change
 * them one-by-one.
 *
 * @param date
 * A date.
 *
 * @returns
 * A string that represents the display date.
 */
export function getEwsRequestString(date: OwaDate): string {
    // formatDate does not handle negative and small years correctly.
    // Negative numbers must be prefixed with -00 and we need to always have 4-digits.
    const year = getYear(date);
    const negPrefix = year < 0 ? '-00' : '';
    let yearStr = Math.abs(year).toString(10);
    while (yearStr.length < 4) {
        yearStr = '0' + yearStr;
    }
    return negPrefix + yearStr + formatDate(date, "-MM-dd'T'HH:mm:ss.l");
}
