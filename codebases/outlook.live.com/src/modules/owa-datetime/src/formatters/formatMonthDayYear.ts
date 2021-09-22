import { getLocalizedString } from '../localization/getLocalizedString';
import { format, localizedFormatter } from './localizedFormatter';
import { getDayFormat } from './formatDay';

export function getMonthDayYearFormat(dateFormat: string, timeFormat: string) {
    let dayFormat = getDayFormat(dateFormat, timeFormat);
    return format(
        getLocalizedString('monthDayYearFormat'),
        getLocalizedString('MMMM'),
        dayFormat,
        getLocalizedString('yyyy')
    );
}

export default localizedFormatter(getMonthDayYearFormat);
