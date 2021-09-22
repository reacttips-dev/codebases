import { getLocalizedString } from '../localization/getLocalizedString';
import { format, localizedFormatter } from './localizedFormatter';
import { getMonthDayFormat } from './formatMonthDay';
import { getShortTimeFormat } from './formatShortTime';

export function getMonthDayShortTimeFormat(dateFormat: string, timeFormat: string) {
    let monthDayFormat = getMonthDayFormat(dateFormat, timeFormat);
    let shortTimeFormat = getShortTimeFormat(dateFormat, timeFormat);
    return format(getLocalizedString('userDateTimeFormat'), monthDayFormat, shortTimeFormat);
}

export default localizedFormatter(getMonthDayShortTimeFormat);
