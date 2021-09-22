import type EndDateRecurrence from 'owa-service/lib/contract/EndDateRecurrence';
import type ExchangeRecurrenceBundle from '../schema/ExchangeRecurrenceBundle';
import type SeriesTime from '../schema/SeriesTime';
import { owaDate } from 'owa-datetime';

const MinutesInHour = 60;
const MillisecondsInMinute = 60 * 1000;

export default function createSeriesTime(bundle: ExchangeRecurrenceBundle): SeriesTime {
    const { startTime, endTime, recurrenceType, timeZone } = bundle;
    const startDate = convertDateStringToNumbers(recurrenceType.RecurrenceRange.StartDate);
    const durationMin = (endTime.getTime() - startTime.getTime()) / MillisecondsInMinute;
    let startTimeMin;
    let startDateTimeInAppointmentTimezone = owaDate(timeZone, startTime.valueOf()); // Returns 2020-01-29T19:30:00.000-10:00
    let startTimeInAppointmentTimezone = startDateTimeInAppointmentTimezone // Returns an array of time in Hours, Minutes
        .toString()
        .split('T')[1]
        .split(':');

    startTimeMin =
        transformStringToNumber(startTimeInAppointmentTimezone[0]) * MinutesInHour +
        transformStringToNumber(startTimeInAppointmentTimezone[1]);

    let seriesTime: SeriesTime = {
        startYear: startDate.year,
        startMonth: startDate.month,
        startDay: startDate.day,
        startTimeMin,
        durationMin,
    };

    if ((recurrenceType.RecurrenceRange as EndDateRecurrence).EndDate) {
        const range = recurrenceType.RecurrenceRange as EndDateRecurrence;
        const endDate = convertDateStringToNumbers(range.EndDate);
        seriesTime = {
            ...seriesTime,
            endDay: endDate.day,
            endMonth: endDate.month,
            endYear: endDate.year,
        };
    } else {
        seriesTime.noEndDate = true;
    }

    return seriesTime;
}

function convertDateStringToNumbers(
    dateString: string
): { day: number; month: number; year: number } {
    const parts = dateString.split('-');
    return {
        year: parseInt(parts[0]),
        month: parseInt(parts[1]),
        day: parseInt(parts[2]),
    };
}

function transformStringToNumber(data: string): number {
    const roundToTwoDigitDecimal: string = Number(data).toFixed(2);
    const computedNumber = Number(roundToTwoDigitDecimal);
    return computedNumber;
}
