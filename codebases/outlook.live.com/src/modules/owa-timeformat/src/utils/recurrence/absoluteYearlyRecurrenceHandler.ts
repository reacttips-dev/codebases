import { format } from 'owa-localize';
import { getLocalizedString } from '../../localization/getLocalizedString';
import { OwaDate, getMonth, getDate, addYears, isBefore, setDate, setMonth } from 'owa-datetime';
import type AbsoluteYearlyRecurrence from 'owa-service/lib/contract/AbsoluteYearlyRecurrence';
import getLocalizedMonth from '../localization/getLocalizedMonth';
import type MonthNamesType from '../../store/schema/MonthNamesType';
import type RecurrencePatternHandler from './RecurrencePatternHandler';

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

function formatRecurrence(pattern: AbsoluteYearlyRecurrence): string {
    return getFormattedString(getLocalizedString('calendarAbsoluteYearlyFormatString'), pattern);
}

function canHandle(pattern: AbsoluteYearlyRecurrence): boolean {
    return !!pattern.DayOfMonth && !!pattern.Month;
}

function formatRecurrenceOption(pattern: AbsoluteYearlyRecurrence): string {
    return getFormattedString(
        getLocalizedString('calendarAbsoluteYearlyOptionFormatString'),
        pattern
    );
}

function getFormattedString(formatString: string, pattern: AbsoluteYearlyRecurrence) {
    let localizedMonth = getLocalizedMonth(pattern.Month as MonthNamesType);

    return format(formatString, localizedMonth, pattern.DayOfMonth);
}

function getNumberedRecurrenceEndDate(
    pattern: AbsoluteYearlyRecurrence,
    start: OwaDate,
    numberOfOccurrences: number
) {
    let firstOccurrence = start;
    let monthIndex = MONTHS_OF_YEAR.indexOf(pattern.Month as MonthNamesType);

    // Technically, the start date isn't necessarily the date of the first firstOccurrence
    if (getMonth(firstOccurrence) != monthIndex) {
        // Set to the correct month
        firstOccurrence = setMonth(firstOccurrence, monthIndex);
    }
    if (getDate(firstOccurrence) != pattern.DayOfMonth) {
        // Set to the correct day
        firstOccurrence = setDate(firstOccurrence, pattern.DayOfMonth);
    }

    // We may have set the date before the start of the recurrence
    if (isBefore(firstOccurrence, start)) {
        // If so, roll to the next month (after the start)
        firstOccurrence = addYears(firstOccurrence, 1);
    }
    return addYears(firstOccurrence, numberOfOccurrences - 1);
}

let handler: RecurrencePatternHandler = {
    canHandle: canHandle,
    formatRecurrence: formatRecurrence,
    formatRecurrenceOption: formatRecurrenceOption,
    getNumberedRecurrenceEndDate: getNumberedRecurrenceEndDate,
    formatOptionsForSummary: formatRecurrenceOption,
};

export default handler;
