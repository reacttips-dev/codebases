import type { OwaDate } from '../schema';
import { owaDate } from '../owaDate';
import { userDate } from '../userDate';
import type { DisplayDateParserConfig } from './DisplayDateParserConfig';
import type { DisplayDateParserRegExp } from './DisplayDateParserRegExp';
import {
    getYear,
    getMonth,
    getDate,
    getHours,
    getMinutes,
    getSeconds,
    getMilliseconds,
} from '../owaDate/getFields';

/**
 * Parses a date/time string based on an OWA Format String.
 *
 * @param value The string to parse.
 * @param regexp The regular expression obtained from getDisplayDateParserRegExp for the desired format.
 * @param config Configuration obtained from getDisplayDateParserConfig, with the set of strings understood by the parser.
 * @param referenceDate An optional reference date/time, which provides default values for each date/time field.
 */
export function parseDisplayDate(
    value: string,
    regexp: DisplayDateParserRegExp,
    config: DisplayDateParserConfig,
    referenceDate?: OwaDate | null | undefined
): OwaDate | null {
    // null, undefined or empty strings are always a no-match.
    if (!value) {
        return null;
    }

    // Match the given value against the regular expression.
    const match = regexp.exec(value.trim());
    if (!match) {
        return null;
    }

    // Start with the reference date.
    referenceDate = referenceDate || userDate(0, 0);
    let year = getYear(referenceDate);
    let month = getMonth(referenceDate);
    let date = getDate(referenceDate);
    let hour = getHours(referenceDate);
    let min = getMinutes(referenceDate);
    let sec = getSeconds(referenceDate);
    let ms = getMilliseconds(referenceDate);
    let pmHour: boolean;

    // Extract values for each field from capturing groups
    const groups = regexp.captureGroups;
    for (var i = 0; i < groups.length; i++) {
        const strValue = match[i + 1];
        const intValue = parseInt(strValue, 10);
        switch (groups[i]) {
            case 'd':
                date = intValue;
                break;
            case 'M':
                // Note, in JavaScript Date months are zero-based.
                month = intValue - 1;
                break;
            case 'n':
                // Month might end up undefined if we don't understand the name.
                // The validation below catches the problem since "0 < undefined === false".
                month = config.monthNamesInUpperCase[strValue.toUpperCase()];
                break;
            case 'y':
                if (strValue.length >= 4 || intValue < 0) {
                    // If year is specified with 4-digits or negative, keep the value as-is.
                    year = intValue;
                } else {
                    // Convert year to 4-digit year, using reference year as starting point.
                    // Ex: when reference year is 2017 and intValue is 18, we have:
                    // 2017 - 2017 % 100 + 18 => 2017 - 17 + 18 => 2000 + 18 => 2018.
                    // This allows us to keep parsed dates "close" to the reference date, without going back to 1918!
                    year = year - (year % 100) + intValue;
                }
                break;
            case 'H':
                hour = intValue;
                break;
            case 'h':
                hour = intValue;
                break;
            case 'm':
                min = intValue;
                break;
            case 's':
                sec = intValue;
                break;
            case 't':
                if (strValue) {
                    pmHour = config.timeIndicators[strValue];

                    // If a non-empty time indicator was parsed but didn't match the localized strings, return null.
                    if (pmHour === undefined) {
                        return null;
                    }
                }

                break;
        }
    }

    // If PM was expressed, adjust the hour.
    if (pmHour === true && hour < 12) {
        hour += 12;
    }

    // If AM was expressed and the hour is 12, adjust the hour
    if (pmHour === false && hour === 12) {
        hour = 0;
    }

    // Validate that fields do not overflow.
    if (0 < date && date < 32 && 0 <= month && month < 12 && hour < 24 && min < 60 && sec < 60) {
        const displaydate = owaDate(referenceDate.tz, year, month, date, hour, min, sec, ms);
        if (getDate(displaydate) === date) {
            return displaydate;
        }
    }

    // In case of overflows.
    return null;
}
