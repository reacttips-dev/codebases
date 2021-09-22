import { format } from 'owa-localize';
import { getLocalizedString } from '../../localization/getLocalizedString';

import { OwaDate, owaDate, isEqual, formatUserTime, isAllDayEvent } from 'owa-datetime';

export default function formatTimeRange(start: OwaDate, end: OwaDate): string {
    if (isAllDayEvent(start, end)) {
        return '';
    } else {
        if (isEqual(start, end)) {
            return format(
                getLocalizedString('calendarRangeTimeNoDurationFormatString'),
                formatUserTime(start)
            );
        }
        return format(
            getLocalizedString('calendarRangeTimeFormatString'),
            formatUserTime(start),
            formatUserTime(owaDate(start, end))
        );
    }
}
