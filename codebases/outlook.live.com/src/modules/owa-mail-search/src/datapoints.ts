import { OwaDate, differenceInCalendarDays } from 'owa-datetime';

/**
 * Gets date range bucket so data can be logged properly.
 */
export function getDateRange(fromDate: OwaDate, toDate: OwaDate): string {
    if (!fromDate || !toDate) {
        return 'None';
    }

    const daysDifference = differenceInCalendarDays(toDate, fromDate);

    if (daysDifference >= 730) {
        return '>2y';
    } else if (daysDifference >= 365) {
        return '1y-2y';
    } else if (daysDifference >= 180) {
        return '6m-1y';
    } else if (daysDifference >= 90) {
        return '3m-6m';
    } else if (daysDifference >= 30) {
        return '1m-3m';
    } else if (daysDifference >= 14) {
        return '2w-1m';
    } else if (daysDifference >= 7) {
        return '1w-2w';
    } else {
        return `${daysDifference}d`;
    }
}
