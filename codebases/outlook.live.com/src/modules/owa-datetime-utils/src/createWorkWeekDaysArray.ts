import type { DayOfWeek } from '@fluentui/date-time-utilities/lib/dateValues/dateValues';
import TimeConstants from './TimeConstants';

/**
 * Converts a bit mask of work days to a day of week array. Assumes that the bitmask has the lowest
 * order bit correspond to sunday, and go upwards from there. Format sat|fri|thurs|wed|tues|mon|sun
 *
 * for example, passing in 22 = 0010110, which results in [mon, tues, thurs]
 * @param workDays The bitmask for the work week days
 */
export default function createWorkWeekDaysArray(workDays: number): DayOfWeek[] {
    let result: DayOfWeek[] = [];
    for (let day = 0; day < TimeConstants.DaysInOneWeek; day++) {
        if (workDays & (1 << day)) {
            result.push(day);
        }
    }
    return result;
}
