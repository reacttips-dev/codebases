import type { DateRange } from 'owa-datetime-utils';
import { isEqual } from 'owa-datetime';

export function isDateRangeDifferent(dateRange: DateRange, prevDateRange: DateRange) {
    return (
        prevDateRange === null ||
        !isEqual(dateRange.start, prevDateRange.start) ||
        !isEqual(dateRange.end, prevDateRange.end)
    );
}
