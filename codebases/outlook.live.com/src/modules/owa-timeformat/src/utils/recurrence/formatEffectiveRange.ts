import { format } from 'owa-localize';
import { getLocalizedString } from '../../localization/getLocalizedString';

import { formatDateString } from '../formatTimeSpan';

import { OwaDate, owaDate } from 'owa-datetime';
import type EndDateRecurrence from 'owa-service/lib/contract/EndDateRecurrence';
import type NumberedRecurrence from 'owa-service/lib/contract/NumberedRecurrence';
import type RecurrenceRangeBaseType from 'owa-service/lib/contract/RecurrenceRangeBaseType';

export default function formatEffectiveRange(
    timeZoneId: string,
    range: RecurrenceRangeBaseType,
    handleNumberedRecurrence: (start: OwaDate, numberOfOccurrences: number) => OwaDate,
    isShortString: boolean
): string {
    const startDate = owaDate(timeZoneId, range.StartDate);
    const formattedStartDate = formatDateString(startDate, isShortString);

    const endDateString = (<EndDateRecurrence>range).EndDate;
    const numberOfOccurrences = (<NumberedRecurrence>range).NumberOfOccurrences;
    const endDate = endDateString
        ? owaDate(timeZoneId, endDateString)
        : numberOfOccurrences
        ? handleNumberedRecurrence(startDate, numberOfOccurrences)
        : null;

    if (endDate) {
        const formattedEndDate = formatDateString(endDate, isShortString);
        return format(
            getLocalizedString('calendarEffectiveWithEndFormatString'),
            formattedStartDate,
            formattedEndDate
        );
    } else {
        return format(
            getLocalizedString('calendarEffectiveWithoutEndFormatString'),
            formattedStartDate
        );
    }
}
