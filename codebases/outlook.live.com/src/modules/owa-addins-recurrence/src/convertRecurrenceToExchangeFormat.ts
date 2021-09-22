import type AddinRecurrence from './schema/AddinRecurrence';
import createDateFromSeriesTimeData from './builders/createDateFromSeriesTimeData';
import createRecurrencePattern from './builders/createRecurrencePattern';
import createRecurrenceRange from './builders/createRecurrenceRange';
import type ExchangeRecurrenceBundle from './schema/ExchangeRecurrenceBundle';
import { getUserTimeZone } from 'owa-session-store';

export default function convertRecurrenceToExchangeFormat(
    recurrence: AddinRecurrence
): ExchangeRecurrenceBundle {
    if (recurrence == null) {
        return null;
    }
    const { seriesTimeJson, recurrenceProperties, recurrenceType, recurrenceTimeZone } = recurrence;

    const { startDay, startMonth, startYear, startTimeMin, durationMin } = seriesTimeJson;

    var timeZone;
    if (!!recurrenceTimeZone) {
        timeZone = recurrenceTimeZone.name;
    } else {
        timeZone = getUserTimeZone();
    }

    return {
        recurrenceType: {
            __type: 'RecurrenceType:#Exchange',
            RecurrenceRange: createRecurrenceRange(seriesTimeJson),
            RecurrencePattern: createRecurrencePattern(recurrenceType, recurrenceProperties),
        },
        timeZone: timeZone,
        startTime: createDateFromSeriesTimeData(startYear, startMonth, startDay, startTimeMin),
        endTime: createDateFromSeriesTimeData(
            startYear,
            startMonth,
            startDay,
            startTimeMin + durationMin
        ),
    };
}
