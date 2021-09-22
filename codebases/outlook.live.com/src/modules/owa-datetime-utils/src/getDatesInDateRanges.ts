import { DateRange, dateRangesOverlap } from './index';
import { OwaDate, startOfDay, endOfDay, addDays, compare } from 'owa-datetime';

/**
 * Returns an array of all dates between the startDate and endDate (inclusive) that have some overlap with at least one of the
 * ranges in dateRanges.
 *
 * e.x. startDate: Jan 1 2020, endDate Jan 7 2020, dateRanges: [ { start: Jan 2 8pm, end: Jan 4 1AM }, { start: Jan 3 12pm, end: Jan 3 8pm}]
 * would return [ Jan 2, Jan 3, Jan 4].
 *
 * This is optimized for a dense calendar
 * @param startDate
 * @param endDate
 * @param dateRanges
 */
export default function getDatesInDateRanges(
    startDate: OwaDate,
    endDate: OwaDate,
    dateRanges: DateRange[]
): OwaDate[] {
    const overlappedDates: OwaDate[] = [];

    // first, we need dateRanges to be sorted by start date
    const sortedDateRanges = dateRanges.sort((range1, range2) => {
        const compareStart = compare(range1.start, range2.start);
        if (compareStart !== 0) {
            return compareStart;
        }
        return compare(range1.end, range2.end);
    });

    let currentDate = startOfDay(startDate);
    let index = 0;

    while (compare(currentDate, endDate) < 0 && index < sortedDateRanges.length) {
        const dateRange = {
            start: currentDate,
            end: endOfDay(currentDate),
        };

        const overlapResult = dateRangesOverlap(sortedDateRanges[index], dateRange, false);

        if (overlapResult <= 0) {
            // date range is either overlapping or completely after current date. In either case, we'll keep the same
            // date range and try the next date in our array
            if (overlapResult === 0) {
                // current range overlaps current day
                overlappedDates.push(currentDate);
            }
            currentDate = addDays(currentDate, 1);
        } else {
            // if the date range is completely before the date, then get the next date range
            index++;
        }
    }

    return overlappedDates;
}
