import type DayOfWeekIndexType from 'owa-service/lib/contract/DayOfWeekIndexType';
import type MonthNamesType from 'owa-timeformat/lib/store/schema/MonthNamesType';

export const SUNDAY_KEY = 'Sunday';
export const MONDAY_KEY = 'Monday';
export const TUESDAY_KEY = 'Tuesday';
export const WEDNESDAY_KEY = 'Wednesday';
export const THURSDAY_KEY = 'Thursday';
export const FRIDAY_KEY = 'Friday';
export const SATURDAY_KEY = 'Saturday';

// TODO: https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/18799: Ability to get this list from a localized library. Sunday may not be the first day of the week everywhere.
// Also need to replace these strings with localized strings.
export const DAYS_OF_WEEK = [
    SUNDAY_KEY,
    MONDAY_KEY,
    TUESDAY_KEY,
    WEDNESDAY_KEY,
    THURSDAY_KEY,
    FRIDAY_KEY,
    SATURDAY_KEY,
];

export const MONTHS_OF_YEAR: MonthNamesType[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export type RecurrenceNameStringType =
    | 'None'
    | 'DailyRecurrence'
    | 'WeeklyRecurrence'
    | 'RelativeMonthlyRecurrence'
    | 'AbsoluteMonthlyRecurrence'
    | 'RelativeYearlyRecurrence'
    | 'AbsoluteYearlyRecurrence';

export const NO_RECURRENCE_METRIC_STRING = 'None';
export const DAILY_RECURRENCE_METRIC_STRING = 'DailyRecurrence';
export const WEEKLY_RECURRENCE_METRIC_STRING = 'WeeklyRecurrence';
export const RELATIVE_MONTHLY_METRIC_STRING = 'RelativeMonthlyRecurrence';
export const ABSOLUTE_MONTHLY_METRIC_STRING = 'AbsoluteMonthlyRecurrence';
export const RELATIVE_YEARLY_METRIC_STRING = 'RelativeYearlyRecurrence';
export const ABSOLUTE_YEARLY_METRIC_STRING = 'AbsoluteYearlyRecurrence';

export const DAY_OF_WEEK_INDEX: DayOfWeekIndexType[] = [
    'None',
    'First',
    'Second',
    'Third',
    'Fourth',
    'Last',
];

export const DAILY_RECURRENCE_TYPE_NAME = 'DailyRecurrence:#Exchange';

export const WEEKLY_RECURRENCE_TYPE_NAME = 'WeeklyRecurrence:#Exchange';

export const RELATIVE_MONTHLY_RECURRENCE_TYPE_NAME = 'RelativeMonthlyRecurrence:#Exchange';

export const ABSOLUTE_MONTHLY_RECURRENCE_TYPE_NAME = 'AbsoluteMonthlyRecurrence:#Exchange';

export const RELATIVE_YEARLY_RECURRENCE_TYPE_NAME = 'RelativeYearlyRecurrence:#Exchange';

export const ABSOLUTE_YEARLY_RECURRENCE_TYPE_NAME = 'AbsoluteYearlyRecurrence:#Exchange';

export const REGENERATING_PATTERN_BASE_RECURRENCE_TYPE_NAME =
    'RegeneratingPatternBaseType:#Exchange';

export const NO_END_RECURRENCE = 'NoEndRecurrence:#Exchange';

export const NUMBERED_RECURRENCE = 'NumberedRecurrence:#Exchange';

export const END_DATE_RECURRENCE = 'EndDateRecurrence:#Exchange';

export const DEFAULT_MONTHS_UNTIL_DAILY_RECURRENCE_END = 3;

export const DEFAULT_WEEKS_UNTIL_WEEKLY_RECURRENCE_END = 25;

export const DEFAULT_YEARS_UNTIL_MONTHLY_RECURRENCE_END = 1;

export const MIN_RECURRENCE_INTERVAL = 1;
export const MAX_RECURRENCE_INTERVAL = 99;
export const RECURRENCE_INTERVAL_COUNT = MAX_RECURRENCE_INTERVAL + 1 - MIN_RECURRENCE_INTERVAL;
