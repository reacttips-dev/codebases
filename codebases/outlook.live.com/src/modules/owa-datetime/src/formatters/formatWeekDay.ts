import { localizedFormatter } from './localizedFormatter';

export function getWeekDayFormat() {
    return 'dddd';
}

export default localizedFormatter(getWeekDayFormat);
