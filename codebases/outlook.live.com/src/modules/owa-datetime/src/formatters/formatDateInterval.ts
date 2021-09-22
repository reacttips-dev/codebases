import {
    getLocalizedString,
    OwaDateTimeLocalizedStringResourceId,
} from '../localization/getLocalizedString';
import { format } from 'owa-localize';

import { getDateFormat } from 'owa-datetime-store';
import { getDateSpecifiersOrder } from './getDateSpecifiersOrder';
import { getDaySpecifier } from './getDaySpecifier';

import type { OwaDate } from '../schema';
import { getYear, getMonth } from '../owaDate';
import formatDate from './formatDate';

/** Formats the date interval of the given display dates. */
export default function formatDateInterval(
    start: OwaDate,
    end: OwaDate,
    weekNumber?: number
): string {
    const dateFormat = getDateFormat();

    // Account for then the dateFormat and strings are not yet initialized
    // by returning empty string so we don't flash bad strings while OWA is loading.
    if (!dateFormat || !getLocalizedString('weekRangeStartEnd')) {
        return '';
    }

    // Account for the order of day/month/year fields and passing in date format
    const order = getDateSpecifiersOrder(dateFormat);
    const daySpecifier = getDaySpecifier(dateFormat);

    // Account for dates in the same year/month, so we don't repeat info in the output.
    const sameYear = getYear(start) == getYear(end);
    const sameMonth = getMonth(start) == getMonth(end);
    const interval = sameYear ? (sameMonth ? 'SameMonth' : 'SameYear') : 'DifferentYears';

    // Format the start and end fields using localized strings and the correct day specifier.
    // Note: we build the formatStringName using a convention to keep the generated code short.
    // The Strings type ensures the strings exist in owa-datetime-strings and allows us to search for their usage.
    function formatIntervalField(date: OwaDate, field: string) {
        const formatStringName = 'weekRange' + interval + field + '_' + order;
        const formatString = getLocalizedString(
            formatStringName as OwaDateTimeLocalizedStringResourceId
        );
        const formatStringWithDay = format(formatString, daySpecifier);
        return formatDate(date, formatStringWithDay);
    }

    const startField = formatIntervalField(start, 'Start');
    const endField = formatIntervalField(end, 'End');

    // Append the fields, accounting for RTL languages with localized string
    let dateString = format(getLocalizedString('weekRangeStartEnd'), startField, endField);
    return weekNumber
        ? format(getLocalizedString('weekRangeWeekNumber'), dateString, weekNumber)
        : dateString;
}
