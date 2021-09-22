import { getLocalizedString } from '../localization/getLocalizedString';
import isOneSpecifierBeforeTheOther from './isOneSpecifierBeforeTheOther';
import { format, localizedFormatter } from './localizedFormatter';

export function getYearMonthFormat(dateFormat: string, timeFormat: string) {
    let yearFirst = isOneSpecifierBeforeTheOther(dateFormat, 'y', 'M');
    let formatString = yearFirst
        ? getLocalizedString('yearMonthFormatYearFirst')
        : getLocalizedString('yearMonthFormatMonthFirst');
    return format(formatString, getLocalizedString('MMMM'), getLocalizedString('yyyy'));
}

export default localizedFormatter(getYearMonthFormat);
