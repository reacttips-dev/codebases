import { differenceInSeconds, OwaDate } from 'owa-datetime';
import TimeConstants from './TimeConstants';

/**
 * Gets rounded number of seconds until an upcoming or current meeting starts
 *
 * @param start start for a meeting
 * @param now current time
 */
export function getTimeUntilSeconds(start: OwaDate, now: OwaDate): number {
    const diffInSeconds = differenceInSeconds(start, now);
    /** round to the current minute so that there is no seconds count down */
    return roundToCurrentMinute(diffInSeconds);
}

function roundToCurrentMinute(diffInSeconds: number): number {
    const extra = diffInSeconds % TimeConstants.SecondsInOneMinute;
    return diffInSeconds - extra + TimeConstants.SecondsInOneMinute;
}
