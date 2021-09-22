import { subWeeks, subMonths, subYears, isEqual } from 'owa-datetime';
import { observableToday } from 'owa-observable-datetime';
import { getStore } from '../store/store';

export enum TimeDropdownValue {
    today = 'today',
    anyDate = 'anydate',
    olderThanAWeek = 'olderthanaweek',
    olderThanAMonth = 'olderthanamonth',
    olderThanThreeMonths = 'olderthanthreemonths',
    olderThanAYear = 'olderthanayear',
    custom = 'custom',
}

export default function getTimeFilterDropdownValue(): TimeDropdownValue {
    const { fromDate, toDate } = getStore();

    if (!fromDate && !toDate) {
        return TimeDropdownValue.anyDate;
    }

    // User has set a single from or to date from advanced search
    if (!toDate) {
        return TimeDropdownValue.custom;
    }

    const todayDate = observableToday();

    if (isEqual(toDate, todayDate) && isEqual(fromDate, todayDate)) {
        return TimeDropdownValue.today;
    }

    if (!fromDate) {
        if (isEqual(toDate, subWeeks(todayDate, 1))) {
            return TimeDropdownValue.olderThanAWeek;
        }
        if (isEqual(toDate, subMonths(todayDate, 1))) {
            return TimeDropdownValue.olderThanAMonth;
        }
        if (isEqual(toDate, subMonths(todayDate, 3))) {
            return TimeDropdownValue.olderThanThreeMonths;
        }
        if (isEqual(toDate, subYears(todayDate, 1))) {
            return TimeDropdownValue.olderThanAYear;
        }
    }

    return TimeDropdownValue.custom;
}
