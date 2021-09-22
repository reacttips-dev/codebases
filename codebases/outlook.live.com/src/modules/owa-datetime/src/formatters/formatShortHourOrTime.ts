import { default as formatShortTime, getShortTimeFormat } from './formatShortTime';
import { getMinutes } from '../owaDate/getFields';
import { getShortHourFormat } from './formatShortHour';
import { localizedFormatter } from './localizedFormatter';
import type { OwaDate } from '../schema';

export function getShortHourOr24HourShortTimeFormat(dateFormat: string, timeFormat: string) {
    const is24Hours = timeFormat.indexOf('H') != -1;
    const getFormat = is24Hours ? getShortTimeFormat : getShortHourFormat;
    return getFormat(dateFormat, timeFormat);
}

/** Formatter used when minutes are zero. Shows only hour in 12h formats, and hour:00 in 24h formats. */
export const formatShortHourOr24HShortTime = localizedFormatter(
    getShortHourOr24HourShortTimeFormat
);

/**
 * Formats the given date as a short hour (ex 2 PM) if minutes are zero
 * or as a short time otherwise (ex 2:30 PM). Seconds are ignored.
 * Always uses short time if user settings ask for 24h formats.
 */
export default function formatShortHourOrTime(displayDate: OwaDate): string {
    const formatter = getMinutes(displayDate) ? formatShortTime : formatShortHourOr24HShortTime;
    return formatter(displayDate);
}
