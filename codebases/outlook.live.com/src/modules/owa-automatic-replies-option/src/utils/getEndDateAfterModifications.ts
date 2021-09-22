import { getStartDate, getEndDate } from '../selectors/getStoreProperties';
import { OwaDate, mergeDateAndTime, addDays, now, isAfter, isBefore } from 'owa-datetime';

/**
 * Utility function to get the new end date based upon start date and current date
 * @returns instance of OwaDate type
 */
export default function getEndDateAfterModifications(): OwaDate {
    const currentDate = now();
    const startDate = getStartDate();
    const endDate = getEndDate();

    // If start time is more than both current time and end time, new end date is start date + 1
    const firstScenario: boolean = isAfter(startDate, currentDate) && isAfter(startDate, endDate);

    if (firstScenario) {
        return getNextDate(startDate, startDate);
    }

    // If start time is less than current time and end time is less than start time or current time, new end date is current date + 1
    const secondScenario: boolean =
        isBefore(startDate, currentDate) &&
        (isBefore(endDate, currentDate) || isBefore(endDate, startDate));

    if (secondScenario) {
        return getNextDate(currentDate, startDate);
    }
    // Return the same end date if neither of the condition is true
    return endDate;
}

function getNextDate(date: OwaDate, time: OwaDate): OwaDate {
    return mergeDateAndTime(addDays(date, 1), time);
}
