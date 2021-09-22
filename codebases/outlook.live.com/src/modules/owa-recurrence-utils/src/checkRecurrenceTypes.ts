import type RecurrenceType from 'owa-service/lib/contract/RecurrenceType';
import {
    ABSOLUTE_MONTHLY_RECURRENCE_TYPE_NAME,
    ABSOLUTE_YEARLY_RECURRENCE_TYPE_NAME,
    DAILY_RECURRENCE_TYPE_NAME,
    RELATIVE_MONTHLY_RECURRENCE_TYPE_NAME,
    RELATIVE_YEARLY_RECURRENCE_TYPE_NAME,
    WEEKLY_RECURRENCE_TYPE_NAME,
    RecurrenceNameStringType,
    NO_RECURRENCE_METRIC_STRING,
    DAILY_RECURRENCE_METRIC_STRING,
    WEEKLY_RECURRENCE_METRIC_STRING,
    RELATIVE_MONTHLY_METRIC_STRING,
    ABSOLUTE_MONTHLY_METRIC_STRING,
    RELATIVE_YEARLY_METRIC_STRING,
    ABSOLUTE_YEARLY_METRIC_STRING,
} from 'owa-recurrence-types';

export function getRecurrenceMetricString(recurrence: RecurrenceType): RecurrenceNameStringType {
    if (recurrence) {
        if (isDailyRecurrence(recurrence)) {
            return DAILY_RECURRENCE_METRIC_STRING;
        } else if (isWeeklyRecurrence(recurrence)) {
            return WEEKLY_RECURRENCE_METRIC_STRING;
        } else if (isRelativeMonthlyRecurrence(recurrence)) {
            return RELATIVE_MONTHLY_METRIC_STRING;
        } else if (isAbsoluteMonthlyRecurrence(recurrence)) {
            return ABSOLUTE_MONTHLY_METRIC_STRING;
        } else if (isRelativeYearlyRecurrence(recurrence)) {
            return RELATIVE_YEARLY_METRIC_STRING;
        } else if (isAbsoluteYearlyRecurrence(recurrence)) {
            return ABSOLUTE_YEARLY_METRIC_STRING;
        } else {
            return NO_RECURRENCE_METRIC_STRING;
        }
    } else {
        return NO_RECURRENCE_METRIC_STRING;
    }
}

export function isMonthlyRecurrence(recurrence: RecurrenceType): boolean {
    return isAbsoluteMonthlyRecurrence(recurrence) || isRelativeMonthlyRecurrence(recurrence);
}

export function isYearlyRecurrence(recurrence: RecurrenceType): boolean {
    return isAbsoluteYearlyRecurrence(recurrence) || isRelativeYearlyRecurrence(recurrence);
}

export function isAbsoluteMonthlyRecurrence(recurrence: RecurrenceType): boolean {
    return (
        recurrence?.RecurrencePattern &&
        recurrence.RecurrencePattern.__type == ABSOLUTE_MONTHLY_RECURRENCE_TYPE_NAME
    );
}

export function isAbsoluteYearlyRecurrence(recurrence: RecurrenceType): boolean {
    return (
        recurrence?.RecurrencePattern &&
        recurrence.RecurrencePattern.__type == ABSOLUTE_YEARLY_RECURRENCE_TYPE_NAME
    );
}

export function isRelativeMonthlyRecurrence(recurrence: RecurrenceType): boolean {
    return (
        recurrence?.RecurrencePattern &&
        recurrence.RecurrencePattern.__type == RELATIVE_MONTHLY_RECURRENCE_TYPE_NAME
    );
}

export function isRelativeYearlyRecurrence(recurrence: RecurrenceType): boolean {
    return (
        recurrence?.RecurrencePattern &&
        recurrence.RecurrencePattern.__type == RELATIVE_YEARLY_RECURRENCE_TYPE_NAME
    );
}

export function isDailyRecurrence(recurrence: RecurrenceType): boolean {
    return (
        recurrence?.RecurrencePattern &&
        recurrence.RecurrencePattern.__type == DAILY_RECURRENCE_TYPE_NAME
    );
}

export function isWeeklyRecurrence(recurrence: RecurrenceType): boolean {
    return (
        recurrence?.RecurrencePattern &&
        recurrence.RecurrencePattern.__type == WEEKLY_RECURRENCE_TYPE_NAME
    );
}
