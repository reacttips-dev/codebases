import type { OwaDate } from '../schema';
import { cleanTimeZoneId, CustomTimeZoneId, getTimeZoneOffset } from 'owa-datetime-store';
import { timestamp } from '../timestamp';
import type { UTCDateFields, IsoDateFields } from 'owa-date-subsets';
import addMinutes from 'owa-date-utc-fn/lib/addMinutes';
import formatUserDate from '../formatters/formatUserDate';
import formatUserDateTime from '../formatters/formatUserDateTime';
import formatUserTime from '../formatters/formatUserTime';
import parse from './parse';

/**
 * A type that represents a time zone parameter.
 * The value can take the following forms:
 * - The identity of the desired time zone as returned by the service's getTimeZone and getTimeZoneOffsets calls.
 * - The value of getUserConfiguration().UserOptions.TimeZone.
 * - An existing OwaDate or other object with a tz field.
 * - If not specified, it defaults to UTC.
 */
export type TimeZoneParameter = string | { readonly tz: string; readonly assumeOffset?: number };

/** Creates a new OwaDate time with the value of now in UTC. */
export function owaDate(): OwaDate;

/**
 * Creates a new OwaDate.
 *
 * @param timeZone The desired target time zone.
 * @param date A value that provides the UTC date of the new date.
 * The value can take the following forms:
 * - An ISO string, such as a string received from EWS.
 * - The number of millisecond since midnight Jan 1 1970, in UTC.
 * - An existing OwaDate which provides the underlying UTC value.
 * - If not specified, it defaults to timestamp().
 *
 * @description
 * This function can be used to create a new OwaDate or to
 * convert an existing date to a different time zone.
 *
 * NOTE: I've removed "Date" as a valid type for the date parameter
 * until we get rid of all DisplayDate usage; otherwise people would
 * be tempted to pass a DisplayDate to owaDate and it would not work
 * as expected. Once we move everything to owaDate we can reintroduce
 * Date and clean-up the calls to getTime() in owaDateMath.
 * Supporting DisplayDate in this call is not a good option because
 * unfortunately there is code that just casts a date to DisplayDate
 * and we would not be able to differentiate it.
 */
export function owaDate(
    timeZone: TimeZoneParameter | null | undefined,
    date?: string | number | OwaDate
): OwaDate;

/**
 * Creates a new OwaDate with the face values of a time-zone specific date & time.
 *
 * @param timeZone The desired target time zone.
 * @param fullYear The year of the desired date, in the specified time zone. Required.
 * @param month The month of the desired date, in the specified time zone. Required.
 * @param day The day of the desired date, in the specified time zone. Defaults to 1.
 * @param hours The hours of the desired date, in the specified time zone. Defaults to 0.
 * @param minutes The minutes of the desired date, in the specified time zone. Defaults to 0.
 * @param seconds The seconds of the desired date, in the specified time zone. Defaults to 0.
 * @param milliseconds The milliseconds of the desired date, in the specified time zone. Defaults to 0.
 */
export function owaDate(
    timeZone: TimeZoneParameter | null | undefined,
    fullYear: number,
    month: number,
    day?: number,
    hours?: number,
    minutes?: number,
    seconds?: number,
    milliseconds?: number
): OwaDate;

/** Creates a new OwaDate with the specified time zone and date values. */
export function owaDate(timeZone: TimeZoneParameter | null | undefined = 'UTC'): OwaDate {
    // Get the offset of the given date in the desired target time zone.
    let tz = typeof timeZone == 'string' ? timeZone : timeZone.tz;
    tz = cleanTimeZoneId(tz);

    // tslint won't let me have rest parameters after a default one.
    // https://github.com/Microsoft/tslint-microsoft-contrib/issues/466
    const dateValues = [];
    for (var i = 1; i < arguments.length; i++) {
        dateValues[i - 1] = arguments[i];
    }

    // The UTC value comes from either a 'date' parameter in its different forms or from date/time
    // values considered local to the given time zone, adjusted to return the corresponding UTC value.
    let utc: Date;
    if (dateValues.length <= 1) {
        // Create a UTC date from the original date parameter (or the UTC of an existing OwaDate)
        const date = dateValues[0] === void 0 ? timestamp() : dateValues[0];
        if (typeof date == 'string') {
            return parse(tz, date);
        }
        utc = new Date((date as OwaDateInstance).utc || date);
    } else {
        // Produce a time-zone local date and adjust to its corresponding UTC
        const [y, mo, d, h, min, s, ms] = dateValues as number[];
        const tzDate = new Date(0);
        tzDate.setUTCFullYear(y, mo || 0, d || 1);
        tzDate.setUTCHours(h || 0, min || 0, s || 0, ms || 0);

        const localOffset = getTimeZoneOffset(tzDate.getTime(), tz, true);
        utc = addMinutes(tzDate, -localOffset);
    }
    utc.toString = utcToString;

    // When parsing, we can now assume that an offset found in the string is the correct one
    // for the target time zone; if that happens, we skip the offset lookup and use whatever
    // was found in the string; this way calendarView can show old dates in correct place.
    const assumeOffset = typeof timeZone == 'string' ? undefined : timeZone.assumeOffset;

    // Create an AdjustedDate that represents the date in the desired time zone.
    // The **UTC** fields of this AdjustedDate have the desired face values.
    // We don't use the local fields of Date, which cannot be used by OWA, because in the
    // system time zone there might be dates that cannot be represented locally. For example,
    // if the system is in PST then there is no local 2am in March 11 2018. To show this date
    // in some other time zone, we need to use the UTC fields to carry the face value.
    const offset = assumeOffset == undefined ? getTimeZoneOffset(utc.getTime(), tz) : assumeOffset;
    const adjusted: AdjustedDate = addMinutes(utc, offset) as any;
    adjusted.offset = -offset || 0;
    adjusted.toString = adjustedToString;

    const owaDate: OwaDateInstance = Object.create(owaDatePrototype);
    owaDate.utc = utc;
    owaDate.tz = tz;
    owaDate.adjusted = adjusted;

    return owaDate;
}

/** Creates a new OwaDate in the UTC time zone. See owaDate for additional information. */
export const utcDate = owaDate.bind(undefined, 'UTC') as {
    (): OwaDate;
    (date: string | number | OwaDate): OwaDate;
    (
        fullYear: number,
        month: number,
        day?: number,
        hours?: number,
        minutes?: number,
        seconds?: number,
        milliseconds?: number
    ): OwaDate;
};

/** Creates a new OwaDate in the default time zone selected by the OWA user. See owaDate for additional information. */
export const userDate = owaDate.bind(undefined, CustomTimeZoneId) as typeof utcDate;

//
// The following types keep our implementation honest so we don't accidentally use the wrong field.
//
type AdjustedDate = UTCDateFields & {
    // NOTE: OWA returns negative numbers for timezones that are behind UTC. Ex: PST is -480.
    // JavaScript's Date.getTimezoneOffset returns positive numbers. Ex: PST is 480.
    // This field follows the JavaScript model since it is returned by OwaDate.getTimezoneOffset.
    offset: number;
};

// The instance fields are visible in the JavaScript object but I don't want to advertise them in OwaDate.
type OwaDateInstance = Date & {
    tz: string;
    utc: UTCDateFields & IsoDateFields;
    adjusted: AdjustedDate;
};

// This object will serve as the OwaDate prototype, so instances will be "instanceOf Date"
// and as such they can be passed to date-fns functions directly - this keeps code short in owaDateMath.
// I'm choosing not to use 'class OwaDate extends Date' because this generates a lot less code.
const owaDatePrototype = (new Date(0) as any) as Record<
    keyof Date | 'getYear' | 'setYear' | 'toGMTString' | 'toUTCString',
    Function
>;

type owaDateFuntioncKey = keyof typeof owaDatePrototype;

function safeAddToPrototype(funcName: owaDateFuntioncKey, func: Function) {
    Object.defineProperty(owaDatePrototype, funcName, { value: func });
}

//
// When overriding Date methods DO NOT use arrow functions.
//
//
// "local" values in OwaDate come from the adjusted date.
//
//

safeAddToPrototype('getDate', function (this: OwaDateInstance) {
    return this.adjusted.getUTCDate();
});
safeAddToPrototype('getFullYear', function (this: OwaDateInstance) {
    return this.adjusted.getUTCFullYear();
});
safeAddToPrototype('getYear', owaDatePrototype.getFullYear);
safeAddToPrototype('getMonth', function (this: OwaDateInstance) {
    return this.adjusted.getUTCMonth();
});
safeAddToPrototype('getDay', function (this: OwaDateInstance) {
    return this.adjusted.getUTCDay();
});
safeAddToPrototype('getHours', function (this: OwaDateInstance) {
    return this.adjusted.getUTCHours();
});
safeAddToPrototype('getMinutes', function (this: OwaDateInstance) {
    return this.adjusted.getUTCMinutes();
});
safeAddToPrototype('getSeconds', function (this: OwaDateInstance) {
    return this.adjusted.getUTCSeconds();
});
safeAddToPrototype('getMilliseconds', function (this: OwaDateInstance) {
    return this.adjusted.getUTCMilliseconds();
});
safeAddToPrototype('getTimezoneOffset', function (this: OwaDateInstance) {
    return this.adjusted.offset;
});
safeAddToPrototype('toDateString', function (this: OwaDateInstance) {
    return this.toString().replace(/T.*/, '');
});
safeAddToPrototype('toTimeString', function (this: OwaDateInstance) {
    return this.toString().replace(/.*T/, '');
});
safeAddToPrototype('toString', function (this: OwaDateInstance) {
    return this.adjusted.toString();
});

// We could allow these functions to do their job when language & timezone are passed
// but we would still need to override them to deal with default parameters. For now,
// we override and just format using the user's default language and time zone.
safeAddToPrototype('toLocaleDateString', function (this: OwaDateInstance) {
    return formatUserDate(this);
});
safeAddToPrototype('toLocaleTimeString', function (this: OwaDateInstance) {
    return formatUserTime(this);
});
safeAddToPrototype('toLocaleString', function (this: OwaDateInstance) {
    return formatUserDateTime(this);
});

//
//
// UTC values in OwaDate come from the utc date.
//
//
safeAddToPrototype('getTime', function (this: OwaDateInstance) {
    return this.utc.getTime(); // If a owaDate is passed to date-fns, it parses the UTC value.
});
safeAddToPrototype('valueOf', owaDatePrototype.getTime);
safeAddToPrototype('getUTCDate', function (this: OwaDateInstance) {
    return this.utc.getUTCDate();
});
safeAddToPrototype('getUTCFullYear', function (this: OwaDateInstance) {
    return this.utc.getUTCFullYear();
});
safeAddToPrototype('getUTCMonth', function (this: OwaDateInstance) {
    return this.utc.getUTCMonth();
});
safeAddToPrototype('getUTCDay', function (this: OwaDateInstance) {
    return this.utc.getUTCDay();
});
safeAddToPrototype('getUTCHours', function (this: OwaDateInstance) {
    return this.utc.getUTCHours();
});
safeAddToPrototype('getUTCMinutes', function (this: OwaDateInstance) {
    return this.utc.getUTCMinutes();
});
safeAddToPrototype('getUTCSeconds', function (this: OwaDateInstance) {
    return this.utc.getUTCSeconds();
});
safeAddToPrototype('getUTCMilliseconds', function (this: OwaDateInstance) {
    return this.utc.getUTCMilliseconds();
});
safeAddToPrototype('toISOString', function (this: OwaDateInstance) {
    return this.utc.toISOString();
});
safeAddToPrototype('toJSON', owaDatePrototype.toISOString);
safeAddToPrototype('toUTCString', owaDatePrototype.toISOString);
safeAddToPrototype('toGMTString', owaDatePrototype.toISOString);

// OwaDate instances are considered read-only, so all setters will throw.
const readOnlyFuncNames: owaDateFuntioncKey[] = [
    'setDate',
    'setFullYear',
    'setHours',
    'setMilliseconds',
    'setMinutes',
    'setMonth',
    'setSeconds',
    'setTime',
    'setUTCDate',
    'setUTCFullYear',
    'setUTCHours',
    'setUTCMilliseconds',
    'setUTCMinutes',
    'setUTCMonth',
    'setUTCSeconds',
    'setYear',
];
function readonly() {
    throw new Error('OwaDate is read-only.');
}
for (var ii = 0; ii < readOnlyFuncNames.length; ii++) {
    safeAddToPrototype(readOnlyFuncNames[ii], readonly);
}

function utcToString(this: Date) {
    return this.toISOString();
}

function adjustedToString(this: Date & AdjustedDate) {
    // See AdjustedDate.offset for more details.
    return this.toISOString().replace('Z', offsetStr(this.offset));
}

function offsetStr(offset: number) {
    if (offset == 0) {
        return 'Z';
    }
    const tzHour = Math.floor(Math.abs(offset / 60));
    const tzMinutes = Math.abs(offset % 60);
    return (offset > 0 ? '-' : '+') + pad(tzHour) + ':' + pad(tzMinutes);
}

function pad(absValue: number) {
    const str = absValue.toString(10);
    return absValue < 10 ? '0' + str : str;
}
