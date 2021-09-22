import { format } from 'owa-localize';
import { getLocalizedString } from '../../localization/getLocalizedString';
import { OwaDate, getDate, addMonths, isBefore, setDate } from 'owa-datetime';
import type AbsoluteMonthlyRecurrence from 'owa-service/lib/contract/AbsoluteMonthlyRecurrence';
import type RecurrencePatternHandler from './RecurrencePatternHandler';

function formatRecurrence(pattern: AbsoluteMonthlyRecurrence): string {
    if (pattern.Interval === 1) {
        return format(
            getLocalizedString('calendarAbsoluteMonthly1FormatString'),
            pattern.DayOfMonth
        );
    } else if (pattern.Interval === 2) {
        return format(
            getLocalizedString('calendarAbsoluteMonthly2FormatString'),
            pattern.DayOfMonth
        );
    } else {
        return format(
            getLocalizedString('calendarAbsoluteMonthlyNFormatString'),
            pattern.DayOfMonth,
            pattern.Interval
        );
    }
}

function formatRecurrenceOption(pattern: AbsoluteMonthlyRecurrence): string {
    return format(
        getLocalizedString('calendarAbsoluteMonthlyOptionFormatString'),
        pattern.DayOfMonth
    );
}

function formatOptionsForSummary(pattern: AbsoluteMonthlyRecurrence): string {
    return format(
        getLocalizedString('calendarAbsoluteMonthlyOptionFormatLowercaseString'),
        pattern.DayOfMonth
    );
}

function canHandle(pattern: AbsoluteMonthlyRecurrence): boolean {
    return !!pattern.DayOfMonth && !!pattern.Interval;
}

function getNumberedRecurrenceEndDate(
    pattern: AbsoluteMonthlyRecurrence,
    start: OwaDate,
    numberOfOccurrences: number
) {
    let firstOccurrence = start;
    if (getDate(firstOccurrence) != pattern.DayOfMonth) {
        // Technically, the start date isn't necessarily the date of the first firstOccurrence
        // Set to the correct day
        firstOccurrence = setDate(firstOccurrence, pattern.DayOfMonth);

        // We may have set the date before the start of the recurrence
        if (isBefore(firstOccurrence, start)) {
            // If so, roll to the next month (after the start)
            firstOccurrence = addMonths(firstOccurrence, 1);
        }
    }
    return addMonths(firstOccurrence, (numberOfOccurrences - 1) * pattern.Interval);
}

let handler: RecurrencePatternHandler = {
    canHandle: canHandle,
    formatRecurrence: formatRecurrence,
    formatRecurrenceOption: formatRecurrenceOption,
    getNumberedRecurrenceEndDate: getNumberedRecurrenceEndDate,
    formatOptionsForSummary: formatOptionsForSummary,
};

export default handler;
