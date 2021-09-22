import { isWithinRange, OwaDate } from 'owa-datetime';

/**
 * Return flag indicating whether the event is happening now
 * This helper is current used by UpNext and TimePanel
 */
export default function isEventHappeningNow(now: OwaDate, start: OwaDate, end: OwaDate): boolean {
    return isWithinRange(now, start, end);
}
