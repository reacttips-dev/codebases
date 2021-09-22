import TimeConstants from 'owa-datetime-utils/lib/TimeConstants';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import {
    addHours,
    addMinutes,
    OwaDate,
    now,
    isSameDay,
    startOfDay,
    startOfHour,
} from 'owa-datetime';

/**
 * Calculate default start times for the provided date.
 * for Today's date returns beginning of start of next hour
 * for other days returns start of working hours
 */
export default function getDefaultStart(date: OwaDate): OwaDate {
    let todayTime = now();
    if (isSameDay(todayTime, date)) {
        return addHours(startOfHour(todayTime), 1);
    } else {
        let { WorkingHours } = getUserConfiguration().UserOptions;
        return addMinutes(
            startOfDay(date),
            // Working hours might be in a different TZ than user TZ.
            // If the difference is large enough, they might cause an overflow into
            // next/previous day. Use % to constrain the difference to the same day.
            WorkingHours.WorkHoursStartTimeInMinutes % TimeConstants.MinutesInOneDay
        );
    }
}
