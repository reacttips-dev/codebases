import { format } from 'owa-localize';
import { getLocalizedString } from '../localization/getLocalizedString';

import type { OwaDate } from 'owa-datetime';
import formatEffectiveRange from './recurrence/formatEffectiveRange';
import formatTimeRange from './recurrence/formatTimeRange';
import getRecurrenceHandler from './recurrence/getRecurrenceHandler';
import type RecurrenceType from 'owa-service/lib/contract/RecurrenceType';

export default function formatRecurrenceTimeSpan(
    start: OwaDate,
    end: OwaDate,
    recurrence: RecurrenceType,
    isShortString: boolean
): string {
    let pattern = recurrence.RecurrencePattern;
    let handler = getRecurrenceHandler(pattern);

    // TZ_BUG: we still have a problem here:
    // If the recurrence PATTERN shows week names then the string returned by
    // formatRecurrence might be incorrect if the time zones are far apart. For example,
    // "every Monday 11:00 PM" created in UTC+14 happens "every Sunday 21:00 PM" in UTC-12,
    // and "every Monday 12:00 AM" created in UTC+14 happens "every Saturday 22:00 PM" in UTC-12.

    // Right now handler.formatRecurrence does not know about time zones and just shows
    // the weekday as-is, so if we have a day-of-week change we end up with a mismatch.
    // Desktop Outlook and Universal "solve" this by showing the original time zone
    // in the recurrence string.

    // To fix this we will either need to convert the weekdays into their corresponding
    // values in the start time zone or we need to do like Desktop Outlook and Universal.
    // If we go with the 2nd option we will require an extra parameter to this function
    // since the tz in the start & end dates might be in the user's time zone, not in the
    // event's original time zone.

    return format(
        getLocalizedString('calendarRecurrenceFormatString'),
        handler.formatRecurrence(pattern),
        formatTimeRange(start, end),
        formatEffectiveRange(
            start.tz,
            recurrence.RecurrenceRange,
            (start, count) => handler.getNumberedRecurrenceEndDate(pattern, start, count),
            isShortString
        )
    );
}
