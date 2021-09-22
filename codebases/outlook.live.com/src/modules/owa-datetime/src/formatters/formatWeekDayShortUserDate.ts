import { getLocalizedString } from '../localization/getLocalizedString';
import { format, localizedFormatter } from './localizedFormatter';
import { getShortUserDateFormat } from './formatShortUserDate';

/**
 * Gets a short version of the user's date format, with just weekday, day and month.
 */
export function getWeekDayShortUserDateFormat(dateFormat: string, timeFormat: string): string {
    return format(getLocalizedString('weekDayDateFormat'), getShortUserDateFormat(dateFormat));
}

export default localizedFormatter(getWeekDayShortUserDateFormat);
