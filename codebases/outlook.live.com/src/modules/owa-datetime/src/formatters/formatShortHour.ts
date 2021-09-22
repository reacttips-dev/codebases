import { localizedFormatter } from './localizedFormatter';

/**
 * Gets the short hour format, from the user's settings, according to these rules:
 *
 * - Respects 12/24 hour settings
 * - Respects relative AM/PM position
 * - No leading zero
 * - AM/PM: only in 12-hour formats
 *
 * In jsMVVM it used to shows minutes if they were not zero, but the format was only
 * effectively used in places where an hour without minutes was used (calendar grid, for example).
 * So from now on, short hour will NOT produce minutes.
 */
export function getShortHourFormat(dateFormat: string, timeFormat: string): string {
    let format = timeFormat
        .replace(/'[^']*'|[^Hht]/g, '') // remove chars inside quotes and chars other than H, h and t outside quotes; keep order and 12/24 hour format.
        .replace('HH', 'H') // convert leading zeros to non-leading zeros
        .replace('hh', 'h');

    // add a space between hour and meridiem; it will only be there in 12-hour formats.
    const meridiemIndex = format.search(/(tt)/);
    if (meridiemIndex >= 0) {
        format = format.replace(/(tt)/, meridiemIndex == 0 ? '$1 ' : ' $1');
    }

    // format comes out as either H, h tt or tt h.
    return format;
}

export default localizedFormatter(getShortHourFormat);
