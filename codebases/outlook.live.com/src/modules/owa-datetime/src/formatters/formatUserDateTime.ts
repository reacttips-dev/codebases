import { getLocalizedString } from '../localization/getLocalizedString';
import { format, localizedFormatter } from './localizedFormatter';

export function getUserDateTimeFormat(dateFormat: string, timeFormat: string): string {
    return format(getLocalizedString('userDateTimeFormat'), dateFormat, timeFormat);
}

export default localizedFormatter(getUserDateTimeFormat);
