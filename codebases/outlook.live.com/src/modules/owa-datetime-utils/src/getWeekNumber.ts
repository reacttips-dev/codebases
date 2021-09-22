import TimeConstants from './TimeConstants';
import {
    getDate,
    getDay,
    getDaysInMonth,
    getMonth,
    getYear,
    OwaDate,
    userDate,
} from 'owa-datetime';
import {
    DayOfWeek,
    FirstWeekOfYear,
    MonthOfYear,
} from '@fluentui/date-time-utilities/lib/dateValues/dateValues';

/**
 * Returns the week number for a date.
 * Week numbers are 1 - 52 (53) in a year
 * @param date - A date to find the week number for.
 * @param firstDayOfWeek - The first day of the week (0-6, Sunday = 0)
 * @param firstWeekOfYear - The first week of the year (1-2)
 * @returns The week's number in the year.
 */
export default (
    date: OwaDate,
    firstDayOfWeek: DayOfWeek,
    firstWeekOfYear: FirstWeekOfYear
): number => {
    // First four-day week of the year - minumum days count
    const fourDayWeek = 4;

    switch (firstWeekOfYear) {
        case FirstWeekOfYear.FirstFullWeek:
            return getWeekOfYearFullDays(date, firstDayOfWeek, TimeConstants.DaysInOneWeek);
        case FirstWeekOfYear.FirstFourDayWeek:
            return getWeekOfYearFullDays(date, firstDayOfWeek, fourDayWeek);
        default:
            return getFirstDayWeekOfYear(date, firstDayOfWeek);
    }
};

/**
 * Helper function for getWeekNumber.
 * Returns week number for a date
 * @param date - current selected date.
 * @param firstDayOfWeek - The first day of week (0-6, Sunday = 0)
 * @param numberOfFullDays - week settings.
 * @returns The week's number in the year.
 */
function getWeekOfYearFullDays(
    date: OwaDate,
    firstDayOfWeek: DayOfWeek,
    numberOfFullDays: number
): number {
    const dayOfYear = getDayOfYear(date) - 1;
    let num = getDay(date) - (dayOfYear % TimeConstants.DaysInOneWeek);

    const lastDayOfPrevYear = userDate(getYear(date) - 1, MonthOfYear.December, 31);
    const daysInYear = getDayOfYear(lastDayOfPrevYear) - 1;

    let num2 =
        (firstDayOfWeek - num + 2 * TimeConstants.DaysInOneWeek) % TimeConstants.DaysInOneWeek;
    if (num2 !== 0 && num2 >= numberOfFullDays) {
        num2 -= TimeConstants.DaysInOneWeek;
    }

    let num3 = dayOfYear - num2;
    if (num3 < 0) {
        num -= daysInYear % TimeConstants.DaysInOneWeek;
        num2 =
            (firstDayOfWeek - num + 2 * TimeConstants.DaysInOneWeek) % TimeConstants.DaysInOneWeek;
        if (num2 !== 0 && num2 + 1 >= numberOfFullDays) {
            num2 -= TimeConstants.DaysInOneWeek;
        }

        num3 = daysInYear - num2;
    }

    return Math.floor(num3 / TimeConstants.DaysInOneWeek + 1);
}

/**
 * Helper function for getWeekNumber.
 * Returns week number for a date
 * @param date - current selected date.
 * @param firstDayOfWeek - The first day of week (0-6, Sunday = 0)
 * @returns The week's number in the year.
 */
function getFirstDayWeekOfYear(date: OwaDate, firstDayOfWeek: number): number {
    const num = getDayOfYear(date) - 1;
    const num2 = getDay(date) - (num % TimeConstants.DaysInOneWeek);
    const num3 =
        (num2 - firstDayOfWeek + 2 * TimeConstants.DaysInOneWeek) % TimeConstants.DaysInOneWeek;

    return Math.floor((num + num3) / TimeConstants.DaysInOneWeek + 1);
}

/**
 * Returns the day number for a date in a year
 * The number of days since January 1st in the particular year.
 * @param date - A date to find the day number for.
 * @returns The day's number in the year.
 */
function getDayOfYear(date: OwaDate): number {
    const month = getMonth(date);
    const year = getYear(date);
    let daysUntilDate = 0;

    for (let i = 0; i < month; i++) {
        daysUntilDate += daysInMonth(i + 1, year);
    }

    daysUntilDate += getDate(date);

    return daysUntilDate;
}

/**
 * Returns the number of days in the month
 * @param month - The month number to target (months 1-12).
 * @param year - The year to target.
 * @returns The number of days in the month.
 */
function daysInMonth(month: number, year: number): number {
    return getDaysInMonth(userDate(year, month, 0));
}
