import { format } from 'owa-localize';
import { getLocalizedString } from '../../localization/getLocalizedString';
import { addMonths, isBefore, OwaDate } from 'owa-datetime';
import type DayOfWeekType from '../../store/schema/DayOfWeekType';
import findRelativeDayOfMonth from './findRelativeDayOfMonth';
import getLocalizedDayOfWeek from '../localization/getLocalizedDayOfWeek';
import getLocalizedDayOfWeekIndex from '../localization/getLocalizedDayOfWeekIndex';
import type RecurrencePatternHandler from './RecurrencePatternHandler';
import type RelativeMonthlyRecurrence from 'owa-service/lib/contract/RelativeMonthlyRecurrence';

let formatRecurrence = function formatRelativeMonthlyRecurrence(
    pattern: RelativeMonthlyRecurrence
): string {
    let localizedDay = getLocalizedDayOfWeek(pattern.DaysOfWeek as DayOfWeekType);
    let localizedDayIndex = getLocalizedDayOfWeekIndex(pattern.DayOfWeekIndex);

    if (pattern.Interval === 1) {
        return format(
            getLocalizedString('calendarRelativeMonthly1FormatString'),
            localizedDayIndex,
            localizedDay
        );
    } else if (pattern.Interval === 2) {
        return format(
            getLocalizedString('calendarRelativeMonthly2FormatString'),
            localizedDayIndex,
            localizedDay
        );
    } else {
        return format(
            getLocalizedString('calendarRelativeMonthlyNFormatString'),
            localizedDayIndex,
            localizedDay,
            pattern.Interval
        );
    }
};

function formatRecurrenceOption(pattern: RelativeMonthlyRecurrence): string {
    let localizedDay = getLocalizedDayOfWeek(pattern.DaysOfWeek as DayOfWeekType);
    let localizedDayIndex = getLocalizedDayOfWeekIndex(pattern.DayOfWeekIndex);

    return format(
        getLocalizedString('calendarRelativeMonthlyOptionFormatString'),
        localizedDayIndex,
        localizedDay
    );
}

function formatOptionsForSummary(pattern: RelativeMonthlyRecurrence): string {
    let localizedDay = getLocalizedDayOfWeek(pattern.DaysOfWeek as DayOfWeekType);
    let localizedDayIndex = getLocalizedDayOfWeekIndex(pattern.DayOfWeekIndex);

    return format(
        getLocalizedString('calendarRelativeMonthlyOptionFormatLowercaseString'),
        localizedDayIndex,
        localizedDay
    );
}

function canHandle(pattern: RelativeMonthlyRecurrence): boolean {
    return !!pattern.DaysOfWeek && !!pattern.DayOfWeekIndex && !!pattern.Interval;
}

function getNumberedRecurrenceEndDate(
    pattern: RelativeMonthlyRecurrence,
    start: OwaDate,
    numberOfOccurrences: number
) {
    // Technically, the start date isn't necessarily the date of the first firstOccurrence
    let firstOcurrence = findRelativeDayOfMonth(
        start,
        pattern.DaysOfWeek as DayOfWeekType,
        pattern.DayOfWeekIndex
    );

    if (isBefore(firstOcurrence, start)) {
        // Get the first occurrence from the next month
        firstOcurrence = findRelativeDayOfMonth(
            addMonths(firstOcurrence, 1),
            pattern.DaysOfWeek as DayOfWeekType,
            pattern.DayOfWeekIndex
        );
    }

    let lastOccurrenceMonth = addMonths(
        firstOcurrence,
        (numberOfOccurrences - 1) * pattern.Interval
    );
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
    formatOptionsForSummary: formatOptionsForSummary,
};

export default handler;
