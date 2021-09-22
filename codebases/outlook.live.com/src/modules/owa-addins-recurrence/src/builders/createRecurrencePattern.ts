import type AbsoluteMonthlyRecurrence from 'owa-service/lib/contract/AbsoluteMonthlyRecurrence';
import type AbsoluteYearlyRecurrence from 'owa-service/lib/contract/AbsoluteYearlyRecurrence';
import type DailyRecurrence from 'owa-service/lib/contract/DailyRecurrence';
import ExchangeRecurrenceType from '../schema/ExchangeRecurrenceType';
import type RecurrencePattern from '../schema/RecurrencePattern';
import RecurrenceType from '../schema/RecurrenceType';
import type RelativeMonthlyRecurrence from 'owa-service/lib/contract/RelativeMonthlyRecurrence';
import type RelativeYearlyRecurrence from 'owa-service/lib/contract/RelativeYearlyRecurrence';
import type WeeklyRecurrence from 'owa-service/lib/contract/WeeklyRecurrence';
import { dayOfWeekToExchange } from '../schema/DayOfWeek';
import { monthToExchange } from '../schema/Month';
import { weekNumberToExchange } from '../schema/WeekNumber';
import type {
    default as RecurrencePropertiesTypes,
    DailyRecurrenceProps,
    WeeklyRecurrenceProps,
    MonthlyRecurrenceProps,
    YearlyRecurrenceProps,
} from '../schema/RecurrencePropertiesTypes';

export default function createRecurrencePattern(
    recurrenceType: RecurrenceType,
    props: RecurrencePropertiesTypes
): RecurrencePattern {
    switch (recurrenceType) {
        case RecurrenceType.Daily:
            return createDailyRecurrence(props as DailyRecurrenceProps);
        case RecurrenceType.Weekday:
            return {
                __type: ExchangeRecurrenceType.Weekly,
                Interval: 1,
                FirstDayOfWeek: 'Monday',
                DaysOfWeek: 'Monday Tuesday Wednesday Thursday Friday',
            } as WeeklyRecurrence;
        case RecurrenceType.Weekly:
            return createWeeklyRecurrence(props as WeeklyRecurrenceProps);
        case RecurrenceType.Monthly:
            return createMonthlyRecurrence(props as MonthlyRecurrenceProps);
        case RecurrenceType.Yearly:
            return createYearlyRecurrence(props as YearlyRecurrenceProps);
        default:
            return null;
    }
}

function createDailyRecurrence(props: DailyRecurrenceProps): DailyRecurrence {
    return {
        __type: ExchangeRecurrenceType.Daily,
        Interval: props.interval,
    };
}

function createWeeklyRecurrence(props: WeeklyRecurrenceProps): WeeklyRecurrence {
    return {
        __type: ExchangeRecurrenceType.Weekly,
        Interval: props.interval,
        FirstDayOfWeek: dayOfWeekToExchange(props.firstDayOfWeek),
        DaysOfWeek: props.days.map(dayOfWeekToExchange).join(' '),
    };
}

function createMonthlyRecurrence(
    props: MonthlyRecurrenceProps
): AbsoluteMonthlyRecurrence | RelativeMonthlyRecurrence {
    if (props.dayOfMonth) {
        return {
            __type: ExchangeRecurrenceType.MonthlyAbsolute,
            DayOfMonth: props.dayOfMonth,
            Interval: props.interval,
        } as AbsoluteMonthlyRecurrence;
    } else {
        return {
            __type: ExchangeRecurrenceType.MonthlyRelative,
            Interval: props.interval,
            DaysOfWeek: dayOfWeekToExchange(props.dayOfWeek),
            DayOfWeekIndex: weekNumberToExchange(props.weekNumber),
        } as RelativeMonthlyRecurrence;
    }
}

function createYearlyRecurrence(
    props: YearlyRecurrenceProps
): AbsoluteYearlyRecurrence | RelativeYearlyRecurrence {
    if (props.dayOfMonth) {
        return {
            __type: ExchangeRecurrenceType.YearlyAbsolute,
            // Interval: props.interval,
            Month: monthToExchange(props.month),
            DayOfMonth: props.dayOfMonth,
        } as AbsoluteYearlyRecurrence;
    } else {
        return {
            __type: ExchangeRecurrenceType.YearlyRelative,
            // Interval: props.interval,
            Month: monthToExchange(props.month),
            DaysOfWeek: dayOfWeekToExchange(props.dayOfWeek),
            DayOfWeekIndex: weekNumberToExchange(props.weekNumber),
        } as RelativeYearlyRecurrence;
    }
}
