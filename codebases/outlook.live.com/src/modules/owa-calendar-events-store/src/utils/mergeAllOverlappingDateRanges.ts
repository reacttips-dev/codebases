import { createDateRangeUnion, DateRange, dateRangesOverlap } from 'owa-datetime-utils';

/**
 * This functions merges all overlapping ranges (if there are any) and returns back
 * new list of date ranges which are disjointed.
 * @param dateRange The ranges which should be merged if they are overlapping.
 */
export function mergeAllOverlappingDateRanges(dateRanges: DateRange[]): DateRange[] {
    if (dateRanges.length === 0) {
        return [];
    }

    const mergedRanges: DateRange[] = [];

    dateRanges.forEach(range => unionWithOverlappingRangeInList(range, mergedRanges));

    return mergedRanges;
}

function unionWithOverlappingRangeInList(dateRange: DateRange, mergedRanges: DateRange[]) {
    let wasMerged = false;
    for (let i = 0; i < mergedRanges.length && !wasMerged; i++) {
        const currentRange = mergedRanges[i];

        if (dateRangesOverlap(currentRange, dateRange, true /* inclusive */) === 0) {
            mergedRanges[i] = createDateRangeUnion(currentRange, dateRange);
            wasMerged = true;
        }
    }

    if (!wasMerged) {
        mergedRanges.push(dateRange);
    }
}
