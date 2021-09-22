import RecurrenceType from '../schema/RecurrenceType';
import type {
    default as RecurrencePropertiesTypes,
    DailyRecurrenceProps,
    WeeklyRecurrenceProps,
    MonthlyRecurrenceProps,
    YearlyRecurrenceProps,
} from '../schema/RecurrencePropertiesTypes';

export default function isValidRecurrencePropertiesForType(
    recurrenceType: RecurrenceType,
    recurrenceProperties: RecurrencePropertiesTypes
): boolean {
    switch (recurrenceType) {
        case RecurrenceType.Daily:
            return isValidDailyRecurrence(recurrenceProperties as DailyRecurrenceProps);
        case RecurrenceType.Weekly:
            return isValidWeeklyRecurrence(recurrenceProperties as WeeklyRecurrenceProps);
        case RecurrenceType.Monthly:
            return isValidMonthlyRecurrence(recurrenceProperties as MonthlyRecurrenceProps);
        case RecurrenceType.Yearly:
            return isValidYearlyRecurrence(recurrenceProperties as YearlyRecurrenceProps);
        case RecurrenceType.Weekday:
            // Weekday Recurrence doesn't have properties
            return !recurrenceProperties;
    }
}

function isValidDailyRecurrence(props: DailyRecurrenceProps): boolean {
    if (!props) {
        return false;
    }

    if (!props.interval || props.interval < 1) {
        return false;
    }
    return true;
}

function isValidWeeklyRecurrence(props: WeeklyRecurrenceProps): boolean {
    if (!props) {
        return false;
    }

    if (!props.interval || props.interval < 1) {
        return false;
    }

    if (!props.days || props.days.length < 1) {
        return false;
    }

    if (!props.firstDayOfWeek) {
        return false;
    }

    return true;
}

function isValidMonthlyRecurrence(props: MonthlyRecurrenceProps): boolean {
    if (!props) {
        return false;
    }

    if (!props.interval || props.interval < 1) {
        return false;
    }

    // valid absolute
    if (!!props.dayOfMonth && !props.dayOfWeek && !props.weekNumber) {
        return true;
    }

    // valid relative
    if (!!props.dayOfWeek && !!props.weekNumber && !props.dayOfMonth) {
        return true;
    }
    return false;
}

function isValidYearlyRecurrence(props: YearlyRecurrenceProps): boolean {
    if (!props) {
        return false;
    }

    if (!props.interval || props.interval < 1) {
        return false;
    }

    if (!props.month) {
        return false;
    }

    // valid Absolute
    if (!!props.dayOfMonth && !props.dayOfWeek && !props.weekNumber) {
        return true;
    }

    // valid Relative
    if (!!props.dayOfWeek && !!props.weekNumber && !props.dayOfMonth) {
        return true;
    }

    return false;
}
