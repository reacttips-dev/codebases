import tryParse from './tryParse';

/**
 * Parse an ISO string into an OwaDate.
 * Throws if the string is invalid.
 *
 * @param tz Target time zone
 * @param s ISO string
 * @param assumeOffsetFromStringIsCorrect
 * Undefined by default.
 * If true and there is an offset in the string, we assume it is correct for the given time zone and use it as-is.
 * The caller takes responsibility for asserting that this offset is in fact correct.
 * For example, if parsing to PST, the offset in the string better be -8 (or -7, for DST).
 * Anything else will produce wrong results. You have been warned!
 * NOTE: this is in place to allow calendarView to parse old dates that are outside the known DST range.
 * This is to deal with a customer escalation.
 */
export default function parse(tz: string, s: string, assumeOffsetFromStringIsCorrect?: boolean) {
    const date = tryParse(tz, s, assumeOffsetFromStringIsCorrect);
    if (date === null) {
        throw new Error('Invalid owaDate: ' + s);
    }
    return date;
}
