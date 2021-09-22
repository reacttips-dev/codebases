import { getLocalizedString } from '../localization/getLocalizedString';
import { getUserTimeFormat } from './formatUserTime';
import { getWeekDayMonthDayYearFormat } from './formatWeekDayMonthDayYear';
import { format, localizedFormatter } from './localizedFormatter';

export function getFullUserDateTimeFormat(dateFormat: string, timeFormat: string): string {
    const longDateFormat = getWeekDayMonthDayYearFormat(dateFormat, timeFormat);
    const userTimeFormat = getUserTimeFormat(dateFormat, timeFormat);
    return format(getLocalizedString('userDateTimeFormat'), longDateFormat, userTimeFormat);
}

export default localizedFormatter(getFullUserDateTimeFormat);
