import { getLocalizedString } from '../localization/getLocalizedString';
import { format, localizedFormatter } from './localizedFormatter';

export function getWeekDayDateTimeWithAtFormat(dateFormat: string, timeFormat: string): string {
    return format(getLocalizedString('weekDayDateTimeWithAtFormat'), dateFormat, timeFormat);
}

export default localizedFormatter(getWeekDayDateTimeWithAtFormat);
