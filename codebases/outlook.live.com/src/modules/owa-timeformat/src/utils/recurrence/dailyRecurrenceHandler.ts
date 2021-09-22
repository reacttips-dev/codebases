import { format } from 'owa-localize';
import { getLocalizedString } from '../../localization/getLocalizedString';
import { addDays, OwaDate } from 'owa-datetime';
import type DailyRecurrence from 'owa-service/lib/contract/DailyRecurrence';
import type RecurrencePatternHandler from './RecurrencePatternHandler';

function formatRecurrence(pattern: DailyRecurrence): string {
    if (pattern.Interval === 1) {
        return getLocalizedString('calendarDaily1Recurrence');
    } else if (pattern.Interval === 2) {
        return getLocalizedString('calendarDaily2Recurrence');
    } else {
        return format(getLocalizedString('calendarDailyNRecurrence'), pattern.Interval);
    }
}

function canHandle(pattern: DailyRecurrence): boolean {
    // Typecasting pattern to any to check for __typename for gql schema type.
    // Note: We cannot refernce GQL schema types here because shared/internal packages which are shared with outside-owa consumers cannot take dependency on owa-graph-schema
    // Work item:107454 [Monarch] Rationalise the __Type property of OWS types
    return (
        (pattern.__type === 'DailyRecurrence:#Exchange' ||
            (pattern as any).__typename === 'DailyRecurrence') &&
        !!pattern.Interval
    );
}

function getNumberedRecurrenceEndDate(
    pattern: DailyRecurrence,
    start: OwaDate,
    numberOfOccurrences: number
) {
    return addDays(start, (numberOfOccurrences - 1) * pattern.Interval);
}

let handler: RecurrencePatternHandler = {
    canHandle: canHandle,
    formatRecurrence: formatRecurrence,
    formatRecurrenceOption: formatRecurrence,
    getNumberedRecurrenceEndDate: getNumberedRecurrenceEndDate,
    formatOptionsForSummary: formatRecurrence,
};

export default handler;
