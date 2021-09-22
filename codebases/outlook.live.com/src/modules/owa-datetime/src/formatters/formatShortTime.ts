import { getLocalizedString } from '../localization/getLocalizedString';
import { localizedFormatter } from './localizedFormatter';
import { getShortHourFormat } from './formatShortHour';

/**
 * Gets the short time format, from the user's settings.
 * Follows the same rules as getShortHour, but appends the
 * language's time separator and minutes to the hour.
 */
export function getShortTimeFormat(dateFormat: string, timeFormat: string): string {
    let shortHourFormat = getShortHourFormat(dateFormat, timeFormat);
    return shortHourFormat.replace(/(H+|h+)/, '$1' + getLocalizedString('timeSeparator') + 'mm');
}

export default localizedFormatter(getShortTimeFormat);
