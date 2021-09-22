import { mutatorAction } from 'satcheljs';
import { getStore } from '../store/store';
import { subWeeks, subMonths, subYears } from 'owa-datetime';
import { logUsage } from 'owa-analytics';
import { TimeDropdownValue } from '../selectors/getTimeFilterDropdownValue';
import { observableToday } from 'owa-observable-datetime';
import { logFilterClientEvent } from '../utils/filterInstrumentationUtils';

export const setDateRangeFromDropdownOption = mutatorAction(
    'setDateRangeFromDropdownOption',
    (value: TimeDropdownValue): void => {
        const mailSearchStore = getStore();
        const todayDate = observableToday();
        logUsage('SearchFilter_DateRangeSelected', { value });
        logFilterClientEvent(TimeDropdownValue[value], true);
        switch (value) {
            case TimeDropdownValue.today:
                mailSearchStore.fromDate = todayDate;
                mailSearchStore.toDate = todayDate;
                break;
            case TimeDropdownValue.olderThanAWeek:
                mailSearchStore.fromDate = null;
                mailSearchStore.toDate = subWeeks(todayDate, 1);
                break;
            case TimeDropdownValue.olderThanAMonth:
                mailSearchStore.fromDate = null;
                mailSearchStore.toDate = subMonths(todayDate, 1);
                break;
            case TimeDropdownValue.olderThanThreeMonths:
                mailSearchStore.fromDate = null;
                mailSearchStore.toDate = subMonths(todayDate, 3);
                break;
            case TimeDropdownValue.olderThanAYear:
                mailSearchStore.fromDate = null;
                mailSearchStore.toDate = subYears(todayDate, 1);
                break;
            case TimeDropdownValue.anyDate:
            default:
                mailSearchStore.fromDate = null;
                mailSearchStore.toDate = null;
                break;
        }
    }
);
