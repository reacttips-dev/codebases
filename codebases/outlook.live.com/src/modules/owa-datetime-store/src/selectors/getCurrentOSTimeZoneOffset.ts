/**
 * Get the time zone offset from the Date object
 *
 * Note - If a user has recently traveled and changed time zones, this
 * may not be accurate (up-to-date) for Firefox
 * Note - Can return DST offsets
 */
export default function getCurrentOSTimeZoneOffset(): number {
    return new Date().getTimezoneOffset();
}
