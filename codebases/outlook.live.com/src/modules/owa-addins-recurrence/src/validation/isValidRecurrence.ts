import type AddinRecurrence from '../schema/AddinRecurrence';
import isValidRecurrencePropertiesForType from './isValidRecurrencePropertiesForType';
import isValidSeriesTime from './isValidSeriesTime';

export default function isValidRecurrence(recurrence: AddinRecurrence): boolean {
    if (recurrence == null) {
        return true;
    }

    if (!recurrence.recurrenceType) {
        return false;
    }

    if (!recurrence.seriesTimeJson || !isValidSeriesTime(recurrence.seriesTimeJson)) {
        return false;
    }

    if (
        !isValidRecurrencePropertiesForType(
            recurrence.recurrenceType,
            recurrence.recurrenceProperties
        )
    ) {
        return false;
    }

    return true;
}
