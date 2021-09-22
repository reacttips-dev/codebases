import { getEwsRequestString } from './getEwsRequestString';
import { userDate } from '../userDate';

/**
 * Converts an ISO date string to an EWS request string.
 * The returned string carries the same date and time values as it is shown
 * to the end user, with the expectation that EWS requests send the user's
 * choice of TimeZoneDefinition. Milliseconds are included.
 *
 * NOTE: The time offset IS NOT included, which can lead to ambiguity when called
 * with the time in which daylight savings ends. It is better to send the full
 * ISO string to the server instead of this cut-down version.Some EWS/REST
 * calls seem to have trouble respecting a full ISO string, so we need to change
 * them one-by-one.
 *
 * @param string date in ISO format, ie 2021-05-12T00:00:00.000Z
 *
 * @returns string date in EWS format, ie 2021-05-12T00:00:00.000
 */
export function getEWSDateStringFromIsoDateString(isoDate: string): string {
    return getEwsRequestString(userDate(isoDate));
}
