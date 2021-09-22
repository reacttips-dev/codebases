import { OwaDate, getDay, addDays, addWeeks, isSameMonth, startOfMonth } from 'owa-datetime';
import type DayOfWeekIndexType from 'owa-service/lib/contract/DayOfWeekIndexType';
import type DayOfWeekType from '../../store/schema/DayOfWeekType';
import getDayOfWeekIndex from './helpers/getDayOfWeekIndex';

const DAYS_IN_WEEK = 7;

export default function findRelativeDayOfMonth(
    month: OwaDate,
    dayOfWeek: DayOfWeekType,
    index: DayOfWeekIndexType
): OwaDate {
    let start = startOfMonth(month);
    let daysOffset = getDayOfWeekIndex(dayOfWeek) - getDay(start);

    if (daysOffset < 0) {
        daysOffset += DAYS_IN_WEEK;
    }

    let firstChosenDayOfMonth = addDays(start, daysOffset);

    switch (index) {
        case 'First':
            return firstChosenDayOfMonth;
        case 'Second':
            return addWeeks(firstChosenDayOfMonth, 1);
        case 'Third':
            return addWeeks(firstChosenDayOfMonth, 2);
        case 'Fourth':
            return addWeeks(firstChosenDayOfMonth, 3);
        case 'Last':
            let lastChosenDayOfMonth = addWeeks(firstChosenDayOfMonth, 4);

            if (!isSameMonth(start, lastChosenDayOfMonth)) {
                // The last day is in the fourth week, not fifth
                lastChosenDayOfMonth = addWeeks(firstChosenDayOfMonth, 3);
            }

            return lastChosenDayOfMonth;
        default:
            throw new Error('Invalid DayOfWeekIndexType');
    }
}
