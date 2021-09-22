import { getLocalizedString } from '../localization/getLocalizedString';
import { format, localizedFormatter } from './localizedFormatter';

export function getWeekDayDateTimeFormat(dateFormat: string, timeFormat: string): string {
    return format(getLocalizedString('weekDayDateTimeFormat'), dateFormat, timeFormat);
}

export default localizedFormatter(getWeekDayDateTimeFormat);
