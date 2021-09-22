import { owaDate } from './owaDate';
import { MILLISECONDS_IN_MINUTE } from 'owa-date-constants';

//                     year   - month  - day    T hour   : minute : secs   . milliseconds          Z  or +/- offset hour : offset minute
const isoRegEx = /^([\+-]?\d+)-(\d{2})(-(\d{2})(T(\d{2})(:(\d{2})(:(\d{2})(.(\d{1,3})\d*)?)?)?)?)?(Z|([\+-])(\d{2})(:(\d{2}))?)?$/;

/**
 * Parse an ISO string into an OwaDate.
 * Returns null if the string is invalid.
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
export default function tryParse(tz: string, s: string, assumeOffsetFromStringIsCorrect?: boolean) {
    const match = s && s.match(isoRegEx);
    if (match) {
        const [
            ,
            sYear,
            sMonth,
            ,
            sDay,
            ,
            sHour,
            ,
            sMinutes,
            ,
            sSeconds,
            ,
            sMilliseconds,
            sOffset,
            sOffsetSign,
            sOffsetHours,
            ,
            sOffsetMinutes,
        ] = match;

        const year = parseInt(sYear);
        const month = parseInt(sMonth) - 1;
        const day = parseInt(sDay) || 1;
        const hours = parseInt(sHour) || 0;
        const minutes = parseInt(sMinutes) || 0;
        const seconds = parseInt(sSeconds) || 0;

        // Extra digits in milliseconds are optional, so apply a correction to make .1 => 100ms, .12 => 120ms and .123 => 123ms.
        const msCorrection = sMilliseconds ? 100 / Math.pow(10, sMilliseconds.length - 1) : 1;
        const milliseconds = (parseInt(sMilliseconds) || 0) * msCorrection;

        if (sOffset) {
            // if an offset is present, create a UTC date with the face-values and offset it to get the expected timestamp.
            const offsetSign = sOffsetSign == '+' ? 1 : -1;
            const offsetHours = parseInt(sOffsetHours) || 0;
            const offsetMinutes = parseInt(sOffsetMinutes) || 0;
            const offset = sOffset == 'Z' ? 0 : offsetSign * (offsetHours * 60 + offsetMinutes);
            const utc = new Date(0);
            utc.setUTCFullYear(year, month, day);
            utc.setUTCHours(hours, minutes, seconds, milliseconds);

            // This is to deal with a customer escalation:
            // Calendar view was showing old events with wrong DST-offset.
            // It happened because the date was outside the known DST offset ranges.
            // In this "solution", we assume the offset found in the string is for the given time zone.
            // In general we can't make this assumption; one might be parsing an arbitrary ISO string,
            // ending in Z or any other random offset, and trying to create the corresponding date in
            // an arbitrary time zone, so we don't know if the offset is right for that time zone.
            // That is way owaDate takes the timestamp and looksup the offset on its own.
            // But then we get it wrong when it falls outside the known ranges.
            // So, for calendarView, we assume we know the time zone we asked for, we assume the server
            // is sending strings with the correct time zones, and we're going to cheat and
            // use this offset as-is. This way we don't look at our offset tables and then
            // we can deal with dates that are outside the known ranges.
            // Obviously, this fixes viewing these events, but it is not a general solution.
            const tzParam = assumeOffsetFromStringIsCorrect ? { tz, assumeOffset: offset } : tz;
            return owaDate(tzParam, utc.getTime() - offset * MILLISECONDS_IN_MINUTE);
        } else {
            // if no offset is present, create a local date in the given time zone
            return owaDate(tz, year, month, day, hours, minutes, seconds, milliseconds);
        }
    }

    // Return null if we fail to parse.
    return null;
}
