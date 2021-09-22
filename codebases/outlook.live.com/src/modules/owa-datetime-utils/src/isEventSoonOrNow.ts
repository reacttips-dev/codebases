import { getTimeUntilSeconds } from './getTimeUntilSeconds';
import type { OwaDate } from 'owa-datetime';
import TimeConstants from './TimeConstants';

const SECONDS_IN_FIFTEEN_MINUTES = TimeConstants.SecondsInOneMinute * 15;

/**
 * Determines whether an up-next event is about to start or has started,
 * for use in highlighting or progressively disclosing UI elements
 *
 * @param start start for a meeting
 * @param now current time
 * @returns true if event will start within 15 minutes or has already started
 */
export function isEventSoonOrNow(start: OwaDate, now: OwaDate): boolean {
    return getTimeUntilSeconds(start, now) <= SECONDS_IN_FIFTEEN_MINUTES;
}
