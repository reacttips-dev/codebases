import type EndDateRecurrence from 'owa-service/lib/contract/EndDateRecurrence';
import type NoEndRecurrence from 'owa-service/lib/contract/NoEndRecurrence';
import type SeriesTime from '../schema/SeriesTime';

export default function createRecurrenceRange(
    seriesTime: SeriesTime
): EndDateRecurrence | NoEndRecurrence {
    const StartDate = createDateString(
        seriesTime.startYear,
        seriesTime.startMonth,
        seriesTime.startDay
    );
    if (seriesTime.noEndDate) {
        return {
            __type: 'NoEndRecurrence:#Exchange',
            StartDate,
        };
    } else {
        const EndDate = createDateString(
            seriesTime.endYear,
            seriesTime.endMonth,
            seriesTime.endDay
        );
        return {
            __type: 'EndDateRecurrence:#Exchange',
            StartDate,
            EndDate,
        };
    }
}

function createDateString(year: number, month: number, day: number): string {
    return `${year}-${prependZero(month)}-${prependZero(day)}`;
}

function prependZero(n: number) {
    return n < 10 ? `0${n}` : `${n}`;
}
