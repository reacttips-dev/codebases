import type AbsoluteMonthlyRecurrence from 'owa-service/lib/contract/AbsoluteMonthlyRecurrence';
import type AbsoluteYearlyRecurrence from 'owa-service/lib/contract/AbsoluteYearlyRecurrence';
import type AddinRecurrence from './schema/AddinRecurrence';
import createSeriesTime from './builders/createSeriesTime';
import type DailyRecurrence from 'owa-service/lib/contract/DailyRecurrence';
import DayOfWeek, { dayOfWeekToAddins } from './schema/DayOfWeek';
import type ExchangeRecurrenceBundle from './schema/ExchangeRecurrenceBundle';
import ExchangeRecurrenceType from './schema/ExchangeRecurrenceType';
import type RecurrenceTimeZone from './schema/RecurrenceTimeZone';
import RecurrenceType from './schema/RecurrenceType';
import type RelativeMonthlyRecurrence from 'owa-service/lib/contract/RelativeMonthlyRecurrence';
import type RelativeYearlyRecurrence from 'owa-service/lib/contract/RelativeYearlyRecurrence';
import type SeriesTime from './schema/SeriesTime';
import type WeeklyRecurrence from 'owa-service/lib/contract/WeeklyRecurrence';
import { getTimeZoneOffset } from 'owa-datetime-store';
import { monthToAddins } from './schema/Month';
import { weekNumberToAddins } from './schema/WeekNumber';

export default function convertRecurrenceToAddinFormat(
    bundle: ExchangeRecurrenceBundle
): AddinRecurrence {
    if (bundle.recurrenceType == null) {
        return null;
    }
    const seriesTimeJson = createSeriesTime(bundle);
    const timeZone: RecurrenceTimeZone = {
        name: bundle.timeZone,
        offset: getTimeZoneOffset(bundle.startTime, bundle.timeZone),
    };
    const pattern = bundle.recurrenceType.RecurrencePattern;
    switch (pattern.__type) {
        case ExchangeRecurrenceType.Daily:
            return createDailyRecurrence(pattern as DailyRecurrence, seriesTimeJson, timeZone);
        case ExchangeRecurrenceType.Weekly:
            return createWeeklyRecurrence(pattern as WeeklyRecurrence, seriesTimeJson, timeZone);
        case ExchangeRecurrenceType.MonthlyAbsolute:
            return createMonthlyAbsoluteRecurrence(
                pattern as AbsoluteMonthlyRecurrence,
                seriesTimeJson,
                timeZone
            );
        case ExchangeRecurrenceType.MonthlyRelative:
            return createMonthlyRelativeRecurrence(
                pattern as RelativeMonthlyRecurrence,
                seriesTimeJson,
                timeZone
            );
        case ExchangeRecurrenceType.YearlyAbsolute:
            return createYearlyAbsoluteRecurrence(
                pattern as AbsoluteYearlyRecurrence,
                seriesTimeJson,
                timeZone
            );
        case ExchangeRecurrenceType.YearlyRelative:
            return createYearlyRelativeRecurrence(
                pattern as RelativeYearlyRecurrence,
                seriesTimeJson,
                timeZone
            );
    }
    return null;
}

function createDailyRecurrence(
    pattern: DailyRecurrence,
    seriesTimeJson: SeriesTime,
    recurrenceTimeZone: RecurrenceTimeZone
): AddinRecurrence {
    return {
        recurrenceProperties: {
            interval: pattern.Interval,
        },
        recurrenceType: RecurrenceType.Daily,
        seriesTimeJson,
        recurrenceTimeZone,
    };
}

function createWeeklyRecurrence(
    pattern: WeeklyRecurrence,
    seriesTimeJson: SeriesTime,
    recurrenceTimeZone: RecurrenceTimeZone
): AddinRecurrence {
    // No props if weekday recurrence
    if (pattern.Interval === 1 && dayOfWeekToAddins(pattern.DaysOfWeek) === DayOfWeek.Weekday) {
        return {
            recurrenceProperties: undefined,
            recurrenceType: RecurrenceType.Weekday,
            seriesTimeJson,
            recurrenceTimeZone,
        };
    }
    return {
        recurrenceProperties: {
            interval: pattern.Interval,
            days: pattern.DaysOfWeek.split(' ').map(dayOfWeekToAddins),
            firstDayOfWeek: dayOfWeekToAddins(pattern.FirstDayOfWeek),
        },
        recurrenceType: RecurrenceType.Weekly,
        seriesTimeJson,
        recurrenceTimeZone,
    };
}

function createMonthlyAbsoluteRecurrence(
    pattern: AbsoluteMonthlyRecurrence,
    seriesTimeJson: SeriesTime,
    recurrenceTimeZone: RecurrenceTimeZone
): AddinRecurrence {
    return {
        recurrenceProperties: {
            interval: pattern.Interval,
            dayOfMonth: pattern.DayOfMonth,
        },
        recurrenceType: RecurrenceType.Monthly,
        seriesTimeJson,
        recurrenceTimeZone,
    };
}

function createMonthlyRelativeRecurrence(
    pattern: RelativeMonthlyRecurrence,
    seriesTimeJson: SeriesTime,
    recurrenceTimeZone: RecurrenceTimeZone
): AddinRecurrence {
    return {
        recurrenceProperties: {
            interval: pattern.Interval,
            dayOfWeek: dayOfWeekToAddins(pattern.DaysOfWeek),
            weekNumber: weekNumberToAddins(pattern.DayOfWeekIndex),
        },
        recurrenceType: RecurrenceType.Monthly,
        seriesTimeJson,
        recurrenceTimeZone,
    };
}

function createYearlyAbsoluteRecurrence(
    pattern: AbsoluteYearlyRecurrence,
    seriesTimeJson: SeriesTime,
    recurrenceTimeZone: RecurrenceTimeZone
): AddinRecurrence {
    return {
        recurrenceProperties: {
            interval: 0, // pattern.Interval,
            dayOfMonth: pattern.DayOfMonth,
            month: monthToAddins(pattern.Month),
        },
        recurrenceType: RecurrenceType.Yearly,
        seriesTimeJson,
        recurrenceTimeZone,
    };
}

function createYearlyRelativeRecurrence(
    pattern: RelativeYearlyRecurrence,
    seriesTimeJson: SeriesTime,
    recurrenceTimeZone: RecurrenceTimeZone
): AddinRecurrence {
    return {
        recurrenceProperties: {
            interval: 0, // pattern.Interval,
            dayOfWeek: dayOfWeekToAddins(pattern.DaysOfWeek),
            weekNumber: weekNumberToAddins(pattern.DayOfWeekIndex),
            month: monthToAddins(pattern.Month),
        },
        recurrenceType: RecurrenceType.Yearly,
        seriesTimeJson,
        recurrenceTimeZone,
    };
}
