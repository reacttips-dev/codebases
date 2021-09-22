import asOwaDateInUserTz from './asOwaDateInUserTz';
import formatMonthDayYear from '../formatters/formatMonthDayYear';
import formatUserDate from '../formatters/formatUserDate';
import formatUserTime from '../formatters/formatUserTime';
import formatYear from '../formatters/formatYear';
import formatYearMonth from '../formatters/formatYearMonth';
import formatMonthName from '../formatters/formatMonthName';

// In certain cases @fluentui/react might call this with a null or undefined value.
// Ex: a date picker with text input and with no previous date selected.
const jsDateFormatter = (fn: typeof formatUserTime) => (date: Date | null | undefined) =>
    date ? fn(asOwaDateInUserTz(date)) : '';

/**
 * Adapter to format dates provided by @fluentui/react's Calendar
 * using OWA's date and time formats.
 */
export const dateTimeFormatter = {
    // When showing year/month and long dates we will respect the user's settings
    formatMonthDayYear: jsDateFormatter(formatMonthDayYear),
    formatMonth: jsDateFormatter(formatMonthName),
    formatMonthYear: jsDateFormatter(formatYearMonth),
    formatYear: jsDateFormatter(formatYear),

    // When showing just a day, we explicitly do not want padded values.
    formatDay: (date: Date) => date.getDate().toString(),

    formatUserDate: jsDateFormatter(formatUserDate),
    formatUserTime: jsDateFormatter(formatUserTime),
};
