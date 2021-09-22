import { getLocalizedString } from '../localization/getLocalizedString';
import { format, localizedFormatter } from './localizedFormatter';

export function getWeekDayMonthDayFormat(dateFormat: string, timeFormat: string): string {
    return format(
        getLocalizedString('weekDayMonthDayFormat'),
        getLocalizedString('MM'),
        getLocalizedString('dd')
    );
}

export default localizedFormatter(getWeekDayMonthDayFormat);
