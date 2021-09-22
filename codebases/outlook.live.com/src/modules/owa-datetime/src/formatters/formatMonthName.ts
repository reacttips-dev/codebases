import { localizedFormatter } from './localizedFormatter';

export function getMonthNameFormat() {
    return 'MMMM';
}

export default localizedFormatter(getMonthNameFormat);
