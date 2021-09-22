import { assertNever } from 'owa-assert';
import { MILLISECONDS_IN_MINUTE } from 'owa-date-constants';
import { owaDate } from './owaDate';
import type { OwaDate } from '../schema';
import { getTimeZoneOffset } from 'owa-datetime-store';

/**
 * Produces a time zone aware wrapper around a UTC-modification function.
 *
 * NOTE: date-fns functions operate in the local fields of a date.
 * This creates a dependency on the browser's timezone which we must avoid.
 * So the owaDate functions must operate in the UTC fields only.
 * This wrapper performs the pre- and post- operation calculations to
 * correct the offsets of the dates so they match the expected values
 * in the desired time zones.
 *
 * @param fn
 * A date modification function that operates on UTC fields only.
 *
 * @param isTimeFn
 * A flag that indicates if the given function is handling time values.
 * These require precise control to account for DST offset changes.
 */
export default (fn: (time: number, amount: number) => Date, isTimeFn: boolean) => (
    date: OwaDate,
    amount: number
) => {
    // Help test cases that incorrectly mock owaDate with Date to realize their mistake.
    if (!date || !date.tz) {
        assertNever(date as never);
    }

    // The instance fields are visible in the JavaScript object but I don't want to advertise them in OwaDate.
    type OwaDateInstance = OwaDate & {
        adjusted: Date & {
            offset: number;
        };
    };

    // The modification functions will operate in the date whose face-values are in the UTC fields.
    // That is our 'adjusted' date in the OwaDate instance.
    const adjustedDate = (date as OwaDateInstance).adjusted;

    // Call the UTC manipulation function in our already adjusted date.
    const newAdjustedDate = fn(+adjustedDate, amount);

    // Now we need to get the new UTC timestamp, using the correct offset.
    // Time-based functions operate with precise control, so revert the original offset.
    // Date-based functions must account for changes that cross DST boundaries.
    // For those we adjust back using the offset of the new date.
    const offsetDiffInMinutes = isTimeFn
        ? -adjustedDate.offset
        : getTimeZoneOffset(newAdjustedDate, date.tz, true);

    // Get the UTC timestamp of the new date and return its OwaDate
    const newUTCTimeInMilliseconds =
        +newAdjustedDate - offsetDiffInMinutes * MILLISECONDS_IN_MINUTE;

    return owaDate(date.tz, newUTCTimeInMilliseconds);
};
