import { getLocalizedString } from '../localization/getLocalizedString';
import { format, localizedFormatter } from './localizedFormatter';
import { getDayFormat } from './formatDay';

export function getShortMonthDayFormat(dateFormat: string, timeFormat: string) {
    let dayFormat = getDayFormat(dateFormat, timeFormat);
    return format(
        getLocalizedString('monthDayYearFormat'),
        getLocalizedString('MMM'),
        dayFormat,
        getLocalizedString('yyyy')
    );
}

export default localizedFormatter(getShortMonthDayFormat);
