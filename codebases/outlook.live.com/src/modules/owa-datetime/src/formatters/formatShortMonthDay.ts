import { format, localizedFormatter } from './localizedFormatter';
import { getLocalizedString } from '../localization/getLocalizedString';
import isOneSpecifierBeforeTheOther from './isOneSpecifierBeforeTheOther';

/**
 * This function produces a format similar to getMonthDayFormat but ignores user settings
 * and hardcodes an abbreviated month and the day without leading zeros.
 * This should be used in places where space is at a premium.
 * Common output is 'MMM d' or 'd MMM'.
 */
export function getShortMonthDayFormat(dateFormat: string, timeFormat: string) {
    let dayFirst = isOneSpecifierBeforeTheOther(dateFormat, 'd', 'M');
    let formatString = dayFirst
        ? getLocalizedString('monthDayFormatDayFirst')
        : getLocalizedString('monthDayFormatMonthFirst');
    return format(formatString, getLocalizedString('MMM'), getLocalizedString('d'));
}

export default localizedFormatter(getShortMonthDayFormat);
