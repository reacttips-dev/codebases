import { format, localizedFormatter } from './localizedFormatter';
import { getDayFormat } from './formatDay';
import { getLocalizedString } from '../localization/getLocalizedString';
import isOneSpecifierBeforeTheOther from './isOneSpecifierBeforeTheOther';

export function getMonthDayFormat(dateFormat: string, timeFormat: string) {
    let dayFormat = getDayFormat(dateFormat, timeFormat);
    let dayFirst = isOneSpecifierBeforeTheOther(dateFormat, 'd', 'M');
    let formatString = dayFirst
        ? getLocalizedString('monthDayFormatDayFirst')
        : getLocalizedString('monthDayFormatMonthFirst');
    return format(formatString, getLocalizedString('MMMM'), dayFormat);
}

export default localizedFormatter(getMonthDayFormat);
