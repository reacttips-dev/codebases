import { addDays, endOfDay, today } from 'owa-datetime';
import type { DateRange } from 'owa-datetime-utils';

/**
 * Gets the date range to use when calculating the upcoming event
 */
export function getUpNextDateRange(): DateRange {
    /**
     * Use 2 days (starting today) as a date range for calculating UpNext event
     */
    const startDateTime = today();
    const endDateTime = addDays(startDateTime, 1);

    return {
        start: startDateTime,
        end: endOfDay(endDateTime),
    };
}
