import { getLocalizedString } from '../localization/getLocalizedString';
import { localizedFormatter } from './localizedFormatter';

export function getShortMonthNameFormat(dateFormat: string, timeFormat: string) {
    return getLocalizedString('MMM');
}

export default localizedFormatter(getShortMonthNameFormat);
