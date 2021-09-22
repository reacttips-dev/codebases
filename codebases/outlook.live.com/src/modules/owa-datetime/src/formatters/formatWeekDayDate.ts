import { getLocalizedString } from '../localization/getLocalizedString';
import { format, localizedFormatter } from './localizedFormatter';

export function getWeekDayDateFormat(dateFormat: string, timeFormat: string): string {
    return format(getLocalizedString('weekDayDateFormat'), dateFormat);
}

export default localizedFormatter(getWeekDayDateFormat);
