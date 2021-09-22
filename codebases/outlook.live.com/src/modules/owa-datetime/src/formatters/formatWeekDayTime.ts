import { getLocalizedString } from '../localization/getLocalizedString';
import { format, localizedFormatter } from './localizedFormatter';

export function getWeekDayTimeFormat(dateFormat: string, timeFormat: string): string {
    return format(getLocalizedString('weekDayTimeFormat'), timeFormat);
}

export default localizedFormatter(getWeekDayTimeFormat);
