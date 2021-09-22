import isOneSpecifierBeforeTheOther from './isOneSpecifierBeforeTheOther';
import { format, localizedFormatter } from './localizedFormatter';
import { getShortWeekDayFormat } from './formatShortWeekDay';
import { getLocalizedString } from '../localization/getLocalizedString';

/**
 * This ignores user settings and hardcodes an abbreviated month and the day without leading zeros.
 * This should be used in places where space is at a premium.
 * Common output is 'ddd, MMM d' or 'ddd, d MMM'.
 */
export function getShortWeekDayMonthDayFormat(dateFormat: string, timeFormat: string) {
    let dayFirst = isOneSpecifierBeforeTheOther(dateFormat, 'd', 'M');
    let formatString = getLocalizedString(
        dayFirst ? 'monthDayWeekDayFormatDayFirst' : 'monthDayWeekDayFormatMonthFirst'
    );
    return format(
        formatString,
        getShortWeekDayFormat(),
        getLocalizedString('MMM'),
        getLocalizedString('d')
    );
}

export default localizedFormatter(getShortWeekDayMonthDayFormat);
