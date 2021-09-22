import { localizedFormatter } from './localizedFormatter';

export function getShortWeekDayFormat() {
    return 'ddd';
}

export default localizedFormatter(getShortWeekDayFormat);
