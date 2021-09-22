import { format } from 'owa-localize';
import { getLocalizedString } from '../../localization/getLocalizedString';
import { OwaDate, getDay, addDays, addWeeks, startOfWeek } from 'owa-datetime';
import type DayOfWeekType from '../../store/schema/DayOfWeekType';
import formatList from '../localization/formatList';
import getDayOfWeekIndex from './helpers/getDayOfWeekIndex';
import getLocalizedDayOfWeek from '../localization/getLocalizedDayOfWeek';
import type RecurrencePatternHandler from './RecurrencePatternHandler';
import type WeeklyRecurrence from 'owa-service/lib/contract/WeeklyRecurrence';

const DAYS_IN_WEEK = 7;

function formatRecurrence(pattern: WeeklyRecurrence): string {
    let days = pattern.DaysOfWeek.split(' ')
        .sort(compareDayOfWeek.bind(null, pattern.FirstDayOfWeek))
        .map(dayOfWeek => getLocalizedDayOfWeek(dayOfWeek as DayOfWeekType));
    let formattedDays = formatList(days);

    if (pattern.Interval === 1) {
        return format(getLocalizedString('calendarWeekly1FormatString'), formattedDays);
    } else if (pattern.Interval === 2) {
        return format(getLocalizedString('calendarWeekly2FormatString'), formattedDays);
    } else {
        return format(
            getLocalizedString('calendarWeeklyNFormatString'),
            formattedDays,
            pattern.Interval
        );
    }
}

function canHandle(pattern: WeeklyRecurrence): boolean {
    return !!pattern.DaysOfWeek && !!pattern.FirstDayOfWeek && !!pattern.Interval;
}

function getNumberedRecurrenceEndDate(
    pattern: WeeklyRecurrence,
    start: OwaDate,
    numberOfOccurrences: number
) {
    let daysOfWeek = pattern.DaysOfWeek.split(' ') as DayOfWeekType[];
    let weekBitmap = getWeekBitmap(daysOfWeek);
    let occurrencesPerWeek = weekBitmap.reduce(
        (total, isInPattern) => (isInPattern ? total + 1 : total),
        0
    );

    // The first week may not cover all selected days. For example, a recurrence that happens every Tuesday and Thursday,
    //  which has a start date on Wednesday, will only have 1 occurrence in the first week.
    let occurrencesInFirstWeek = getNumberOccurrencesInWeekAfterStart(
        start,
        weekBitmap,
        pattern.FirstDayOfWeek as DayOfWeekType
    );

    if (numberOfOccurrences <= occurrencesInFirstWeek) {
        return getNthDayInWeek(weekBitmap, start, numberOfOccurrences);
    } else {
        let occurrencesAfterFirstWeek = numberOfOccurrences - occurrencesInFirstWeek;
        let fullOrPartialWeeks = Math.ceil(occurrencesAfterFirstWeek / occurrencesPerWeek);
        let lastWeek = addWeeks(start, pattern.Interval * fullOrPartialWeeks);

        let startOfLastWeek = startOfWeek(
            lastWeek,
            getDayOfWeekIndex(pattern.FirstDayOfWeek as DayOfWeekType)
        );
        let ocurrencesInLastWeek =
            nonNegativeMod(occurrencesAfterFirstWeek, occurrencesPerWeek) || occurrencesPerWeek;

        return getNthDayInWeek(weekBitmap, startOfLastWeek, ocurrencesInLastWeek);
    }
}

let handler: RecurrencePatternHandler = {
    canHandle: canHandle,
    formatRecurrence: formatRecurrence,
    formatRecurrenceOption: formatRecurrence,
    getNumberedRecurrenceEndDate: getNumberedRecurrenceEndDate,
    formatOptionsForSummary: formatRecurrence,
};

export default handler;

// Internal helper methods
function compareDayOfWeek(
    firstDayOfWeek: DayOfWeekType,
    dayA: DayOfWeekType,
    dayB: DayOfWeekType
): number {
    const dayOrdering = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        // We shouldn't be getting "Day", "Weekday", or "WeekendDay" as part of a collection,
        // so we really don't care about the comparison values for them.
        Day: 0,
        Weekday: 0,
        WeekendDay: 0,
    };

    let startingIndex = dayOrdering[firstDayOfWeek];

    let indexA = nonNegativeMod(dayOrdering[dayA] - startingIndex, 7);
    let indexB = nonNegativeMod(dayOrdering[dayB] - startingIndex, 7);

    return indexA - indexB;
}

/**
 * Returns an array of 7 booleans, matching the 7 days of the week (starting with Sunday).
 * Each index will indicate whether the corresponding day is covered by the recurrence pattern
 * @param days Days covered by the recurrence pattern
 */
function getWeekBitmap(days: DayOfWeekType[]): boolean[] {
    let weekBitmap = Array(DAYS_IN_WEEK);

    days.forEach(day => {
        switch (day) {
            case 'Weekday':
                // TODO: VSO:11470 - Do we need to localize this?
                weekBitmap[getDayOfWeekIndex('Monday')] = true;
                weekBitmap[getDayOfWeekIndex('Tuesday')] = true;
                weekBitmap[getDayOfWeekIndex('Wednesday')] = true;
                weekBitmap[getDayOfWeekIndex('Thursday')] = true;
                weekBitmap[getDayOfWeekIndex('Friday')] = true;
                break;
            case 'WeekendDay':
                // TODO: VSO:11470 - Do we need to localize this?
                weekBitmap[getDayOfWeekIndex('Saturday')] = true;
                weekBitmap[getDayOfWeekIndex('Sunday')] = true;
                break;
            case 'Day':
                // Mark all values as true
                for (let i = 0; i < weekBitmap.length; i++) {
                    weekBitmap[i] = true;
                }
                break;
            default:
                weekBitmap[getDayOfWeekIndex(day)] = true;
        }
    });

    return weekBitmap;
}

function nonNegativeMod(a: number, modulo: number): number {
    // The built-in '%' modulo operator can return a negative number if applied to a negative number
    // This function operates similar to the C# modulo operator, in that the return value is always
    // in the range of [0, modulo).
    return ((a % modulo) + modulo) % modulo;
}

/**
 * Finds the n-th day of the week after the start date that is within the recurrence pattern.
 * @param weekBitmap A Sunday-based-indexed boolean array of what days of the week are part of the pattern
 * @param start The date to start searching from
 * @param n The index (1-based) of pattern days to return after the start date
 */
function getNthDayInWeek(weekBitmap: boolean[], start: OwaDate, n: number) {
    let i = getDay(start);
    let occurrencesSeen = 0;

    while (occurrencesSeen < n) {
        if (weekBitmap[nonNegativeMod(i, DAYS_IN_WEEK)]) {
            occurrencesSeen++;
        }
        i++;
    }

    // When we hit the break condition on the while loop, we'll have over-counted by one
    i--;

    return addDays(start, nonNegativeMod(i - getDay(start), DAYS_IN_WEEK));
}

function getNumberOccurrencesInWeekAfterStart(
    start: OwaDate,
    weekBitmap: boolean[],
    firstDayOfWeek: DayOfWeekType
) {
    let firstDayOfWeekIndex = getDayOfWeekIndex(firstDayOfWeek);
    let i = getDay(start);
    let count = 0;

    do {
        if (weekBitmap[i]) {
            count++;
        }

        i = nonNegativeMod(i + 1, DAYS_IN_WEEK);
    } while (i !== firstDayOfWeekIndex);

    return count;
}
