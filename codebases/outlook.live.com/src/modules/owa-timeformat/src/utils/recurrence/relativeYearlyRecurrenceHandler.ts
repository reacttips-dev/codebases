import { format } from 'owa-localize';
import { getLocalizedString } from '../../localization/getLocalizedString';
import { OwaDate, getMonth, addYears, isBefore, setMonth } from 'owa-datetime';
import type DayOfWeekType from '../../store/schema/DayOfWeekType';
import findRelativeDayOfMonth from './findRelativeDayOfMonth';
import getLocalizedDayOfWeek from '../localization/getLocalizedDayOfWeek';
import getLocalizedDayOfWeekIndex from '../localization/getLocalizedDayOfWeekIndex';
import getLocalizedMonth from '../localization/getLocalizedMonth';
import type MonthNamesType from '../../store/schema/MonthNamesType';
import type RecurrencePatternHandler from './RecurrencePatternHandler';
import type RelativeYearlyRecurrence from 'owa-service/lib/contract/RelativeYearlyRecurrence';

// The index into this instance is the 0-based index of the month,
// used when calling setMonth
const MONTHS_OF_YEAR: MonthNamesType[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

function formatRecurrence(pattern: RelativeYearlyRecurrence): string {
    return getFormattedString(getLocalizedString('calendarRelativeYearlyFormatString'), pattern);
}

function formatRecurrenceOption(pattern: RelativeYearlyRecurrence): string {
    return getFormattedString(
        getLocalizedString('calendarRelativeYearlyOptionFormatString'),
        pattern
    );
}

function getFormattedString(formatString: string, pattern: RelativeYearlyRecurrence) {
    let localizedDay = getLocalizedDayOfWeek(pattern.DaysOfWeek as DayOfWeekType);
    let localizedDayIndex = getLocalizedDayOfWeekIndex(pattern.DayOfWeekIndex);
    let localizedMonth = getLocalizedMonth(pattern.Month as MonthNamesType);

    return format(formatString, localizedDayIndex, localizedDay, localizedMonth);
}

function canHandle(pattern: RelativeYearlyRecurrence): boolean {
    return !!pattern.DaysOfWeek && !!pattern.Month && !!pattern.DayOfWeekIndex;
}

function getNumberedRecurrenceEndDate(
    pattern: RelativeYearlyRecurrence,
    start: OwaDate,
    numberOfOccurrences: number
) {
    // Technically, the start date isn't necessarily the date of the first firstOccurrence
    let firstOccurrence = start;
    let monthIndex = MONTHS_OF_YEAR.indexOf(pattern.Month as MonthNamesType);

    if (getMonth(firstOccurrence) != monthIndex) {
        // Set to the correct month
        firstOccurrence = setMonth(firstOccurrence, monthIndex);
    }

    firstOccurrence = findRelativeDayOfMonth(
        firstOccurrence,
        pattern.DaysOfWeek as DayOfWeekType,
        pattern.DayOfWeekIndex
    );

    if (isBefore(firstOccurrence, start)) {
        // Get the first occurrence from the next month
        firstOccurrence = findRelativeDayOfMonth(
            addYears(firstOccurrence, 1),
            pattern.DaysOfWeek as DayOfWeekType,
            pattern.DayOfWeekIndex
        );
    }

    let lastOccurrenceMonth = addYears(firstOccurrence, numberOfOccurrences - 1);
    return findRelativeDayOfMonth(
        lastOccurrenceMonth,
        pattern.DaysOfWeek as DayOfWeekType,
        pattern.DayOfWeekIndex
    );
}

let handler: RecurrencePatternHandler = {
    canHandle: canHandle,
    formatRecurrence: formatRecurrence,
    formatRecurrenceOption: formatRecurrenceOption,
    getNumberedRecurrenceEndDate: getNumberedRecurrenceEndDate,
    formatOptionsForSummary: formatRecurrenceOption,
};

export default handler;
