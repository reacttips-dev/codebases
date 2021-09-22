/**
 * Use these utils any place you want to display a time/date based on a timestamp or moment
 * to ensure we are formatting and handling things like timezone logic consistently
 */

import moment from 'moment-timezone';
import timezone from 'js/lib/timezone';
import user from 'js/lib/user';
import _t from 'i18n!nls/page';

/**
 * When adding a new format, please be sure the new format adheres to the following:
 * 1) whenever a time is displayed, also display the timezone
 * 2) use the localized formatting whenever possible
 */

export const MOMENT_FORMATS = Object.freeze({
  /** ex: 15 */
  DAY: 'D',
  /** ex: 02/24 */
  DAY_AND_MONTH: 'DAY_AND_MONTH',
  TIME_ONLY_CONDENSED: 'HHmmss',
  /** ex: 3:52 AM PST */
  TIME_ONLY_DISPLAY: 'LT z',
  /** ex. 3:52 AM */
  TIME_ONLY_DISPLAY_NO_TZ: 'LT',
  TIME_ONLY_COMMON: ['LT', 'h:mmA', 'HH:mm', 'hh:mmA', 'hh:mm A', 'hh:mm a', 'h:mm a', 'hh:mma', 'h:mma'],
  DATE_COMMON: ['LL', 'L', 'l', 'll', 'MMMM DD,YYYY', 'MMMM D,YYYY', 'MMMM D, YYYY', 'M/DD/YY', 'M/DD/YYYY'],
  /** mm/dd/yyyy */
  US_LOCAL_DATE: 'L',
  /** ex: PST */
  TIMEZONE_ONLY_DISPLAY: 'z',
  /** ex: 2/24/17 3:52 AM PST */
  SHORT_DATETIME_DISPLAY: 'l LT z',
  /** ex: 2/24/17 3:52:44 AM PST */
  SHORT_DATETIME_DISPLAY_SECONDS: 'l LTS z',
  /** ex: 2/24/17 3:52:44 AM */
  SHORT_DATETIME_DISPLAY_WITHOUT_TIMEZONE: 'l LT',
  /** ex: Mo - (Monday) */
  SHORT_WEEKDAY_DISPLAY: 'dd',
  SHORT_WEEKDAY: 'd',
  /** ex. Sundays at 11:59 PM PST */
  WEEK_DAY_TIME_ONLY: 'dddd[s] [at] LT z',
  SHORT_MONTH_ONLY_DISPLAY: 'MMM',
  /** ex: Feb 24 */
  SHORT_MONTH_DAY_DISPLAY: 'SHORT_MONTH_DAY_DISPLAY',
  /** ex: 2/24/2017 */
  SHORT_DATE_ONLY_DISPLAY: 'l',
  /** ex: Feb 24, 2017 */
  MED_DATE_ONLY_DISPLAY: 'll',
  /** ex: Feb 24, 2017 3:52 AM PST */
  MED_DATETIME_DISPLAY: 'lll z',
  /** ex: Feb 24, 2017 3:52 AM */
  MED_DATETIME_DISPLAY_NO_TZ: 'lll',
  /** ex: 3:52 AM PST Feb 24, 2017 */
  MED_TIMEDATE_DISPLAY: 'LT z ll',
  /** ex: Feb 24, 3:52 AM PST */
  MED_DATETIME_NO_YEAR_DISPLAY: 'MED_DATETIME_NO_YEAR_DISPLAY',
  /** ex: February 24, 2017 3:52 AM PST */
  LONG_DATETIME_DISPLAY: 'LLL z',
  /** ex: February 24, 3:52 AM PST */
  LONG_DATETIME_NO_YEAR_DISPLAY: 'LONG_DATETIME_NO_YEAR_DISPLAY',
  /** ex: February 24, 2017 */
  LONG_DATE_ONLY_DISPLAY: 'LL',
  /** ex: February */
  LONG_MONTH_ONLY_DISPLAY: 'MMMM',
  /** ex. February 2017 */
  LONG_MONTH_YEAR_DISPLAY: 'MMMM YYYY',
  /** ex: February 24 */
  LONG_DATE_ONLY_NO_YEAR_DISPLAY: 'LONG_DATE_ONLY_NO_YEAR_DISPLAY',
  /** ex. 13 Apr 2020 at 11:45:34 AM */
  LONG_DATE_AT_TIME_DISPLAY: 'D MMM YYYY [at] LT',
  /** ex: 1410715640579 */
  TIMESTAMP: 'x',
} as const);

export type MomentFormat = typeof MOMENT_FORMATS[keyof typeof MOMENT_FORMATS];

/**
 * These formats are necessary because we want to display in locale-aware date formats, but don't
 * want to show the year, which is not supported by the built-in locale-aware moment formats. These methods
 * manually  manipulate the locale-aware strings to remove the year as best as possible.
 *
 * Note from kodell: The initial implementation here almost certainly doesn't handle all languages 100% ideally,
 * so likely should be revisited and improved in the future.
 *
 * There is an open ticket to investigate better long term solutions here: https://coursera.atlassian.net/browse/LP-1034
 * For now, we can continue to add special cases for custom formats using these tokens https://momentjs.com/docs/#/displaying/
 */
const getLocaleModifiedMomentFormat = (
  momentWithTimezone: moment.Moment,
  formatString: MomentFormat | string,
  localeOverride: moment.LocaleSpecifier = _t.getLocale()
): MomentFormat | string => {
  const momentLocaleData = momentWithTimezone.locale(localeOverride).localeData();

  // ex: 02/24
  if (formatString === MOMENT_FORMATS.DAY_AND_MONTH) {
    return momentLocaleData
      .longDateFormat('L')
      .replace(/Y/g, '')
      .replace(/^\W|\W$|\W\W/g, '');
  }

  // ex: Feb 24
  else if (formatString === MOMENT_FORMATS.SHORT_MONTH_DAY_DISPLAY) {
    // TODO: extract 年 out of regex and replace it with a case for 'zh' or 'zh-*' that returns a formatted string. Document with test cases
    switch (_t.getLocale()) {
      case 'es':
        return 'D [de] MMM';
      default:
        return momentLocaleData.longDateFormat('ll').replace(/[,Y年]/g, '').trim();
    }
  }

  // ex: Feb 24, 3:52 AM PST
  else if (formatString === MOMENT_FORMATS.MED_DATETIME_NO_YEAR_DISPLAY) {
    // TODO: extract 年 out of regex and replace it with a case for 'zh' or 'zh-*' that returns a formatted string. Document with test cases
    switch (_t.getLocale()) {
      case 'es':
        return 'D [de] MMM LT z';
      default: {
        const localizedFormat = momentLocaleData.longDateFormat('lll').replace(/[Y年]/g, '') + ' z';
        return localizedFormat.replace(/\s\s/g, ' ');
      }
    }
  }

  // ex: February 24, 3:52 AM PST
  else if (formatString === MOMENT_FORMATS.LONG_DATETIME_NO_YEAR_DISPLAY) {
    // TODO: extract 年 out of regex and replace it with a case for 'zh' or 'zh-*' that returns a formatted string. Document with test cases
    switch (_t.getLocale()) {
      case 'es':
        return 'D [de] MMMM LT z';
      default: {
        const localizedFormat = momentLocaleData.longDateFormat('LLL').replace(/[Y年]/g, '') + ' z';
        return localizedFormat.replace(/\s\s/g, ' ');
      }
    }
  }

  // ex: February 24
  else if (formatString === MOMENT_FORMATS.LONG_DATE_ONLY_NO_YEAR_DISPLAY) {
    // TODO: extract 年 out of regex and replace it with a case for 'zh' or 'zh-*' that returns a formatted string. Document with test cases
    switch (_t.getLocale()) {
      case 'es':
        return 'D [de] MMMM';
      default:
        return momentLocaleData.longDateFormat('LL').replace(/[Y年]/g, '').replace(', ', '').trim();
    }
  }

  return formatString;
};

const getTimezone = (timezoneOverride?: string | null): string => {
  return timezoneOverride || user.getUserTimezone() || timezone.get();
};

const getMoment = (value: number | string | moment.Moment | Date | undefined, format?: string) => {
  // Calling moment() on a moment will clone it.
  return moment(value, format);
};

const getMomentWithTimezone = (
  value: number | string | moment.Moment | Date | undefined,
  timezoneOverride?: string | null,
  format?: string
) => {
  return getMoment(value, format).tz(getTimezone(timezoneOverride));
};

export const momentWithUserTimezone = (
  value?: number | string | moment.Moment | Date | undefined,
  timezoneOverride?: string | null,
  format?: string
) => {
  return getMomentWithTimezone(value, timezoneOverride, format);
};

export function formatDateTimeDisplay(
  value: number | string | moment.Moment | Date,
  formatString?: MomentFormat,
  timezoneOverride?: string | null,
  localeOverride?: moment.LocaleSpecifier
): string;

/**
 * @deprecated Please use format string values from `MOMENT_FORMATS` constant. For example:
 *
 * ```typescript
 * import { formatDateTimeDisplay, MOMENT_FORMATS } from 'js/utils/DateTimeUtils';
 * ...
 * formatDateTimeDisplay(time, MOMENT_FORMATS.SHORT_DATETIME_DISPLAY);
 * ```
 *
 * You can add this format string to `MOMENT_FORMATS` in static/js/utils/DateTimeUtils/DateTimeUtils.ts
 *
 * When adding a new format, please be sure the new format adheres to the following:
 * 1. Whenever a time is displayed, also display the timezone.
 * 2. Use the localized formatting whenever possible.
 * */
export function formatDateTimeDisplay(
  value: number | string | moment.Moment | Date,
  formatString?: string,
  timezoneOverride?: string | null,
  localeOverride?: moment.LocaleSpecifier
): string;

export function formatDateTimeDisplay(
  value: number | string | moment.Moment | Date,
  formatString: MomentFormat | string = MOMENT_FORMATS.MED_DATETIME_DISPLAY,
  timezoneOverride?: string | null,
  localeOverride?: moment.LocaleSpecifier
) {
  let momentWithTimezone = getMomentWithTimezone(value, timezoneOverride);

  if (localeOverride) {
    momentWithTimezone = momentWithTimezone.locale(localeOverride);
  }

  const localeModifiedMomentFormat = getLocaleModifiedMomentFormat(momentWithTimezone, formatString, localeOverride);
  return momentWithTimezone.format(localeModifiedMomentFormat as string);
}

export const formatCurrentDateTime = (
  formatString: MomentFormat = MOMENT_FORMATS.MED_DATETIME_DISPLAY,
  timezoneOverride?: string
) => {
  return getMomentWithTimezone(moment(), timezoneOverride).format(formatString as string);
};

export const getUserTimezone = (timezoneOverride?: string): string => {
  return getTimezone(timezoneOverride);
};

export const getUserTimezoneAbbr = (timezoneOverride?: string): string => {
  return moment.tz(getTimezone(timezoneOverride)).zoneAbbr();
};

export const hasEqualUTCOffset = (timezone1: string, timezone2: string): boolean => {
  if (!timezone1 || !timezone2) {
    return false;
  }

  const timezone1UTCOffset = moment().tz(timezone1).format('Z');
  const timezone2UTCOffset = moment().tz(timezone2).format('Z');

  return timezone1UTCOffset === timezone2UTCOffset;
};

export default {
  momentWithUserTimezone,
  formatDateTimeDisplay,
  formatCurrentDateTime,
  getUserTimezone,
  getUserTimezoneAbbr,
  hasEqualUTCOffset,
  ...MOMENT_FORMATS,
};

export const {
  DAY,
  DAY_AND_MONTH,
  DATE_COMMON,
  TIME_ONLY_DISPLAY,
  TIMEZONE_ONLY_DISPLAY,
  TIME_ONLY_DISPLAY_NO_TZ,
  SHORT_DATETIME_DISPLAY,
  SHORT_MONTH_DAY_DISPLAY,
  MED_DATETIME_DISPLAY_NO_TZ,
  SHORT_DATE_ONLY_DISPLAY,
  SHORT_DATETIME_DISPLAY_SECONDS,
  SHORT_DATETIME_DISPLAY_WITHOUT_TIMEZONE,
  SHORT_WEEKDAY,
  SHORT_WEEKDAY_DISPLAY,
  WEEK_DAY_TIME_ONLY,
  MED_DATE_ONLY_DISPLAY,
  MED_DATETIME_DISPLAY,
  MED_TIMEDATE_DISPLAY,
  MED_DATETIME_NO_YEAR_DISPLAY,
  LONG_DATETIME_DISPLAY,
  LONG_DATETIME_NO_YEAR_DISPLAY,
  LONG_DATE_ONLY_DISPLAY,
  LONG_MONTH_YEAR_DISPLAY,
  LONG_DATE_AT_TIME_DISPLAY,
  TIME_ONLY_COMMON,
  TIME_ONLY_CONDENSED,
  LONG_DATE_ONLY_NO_YEAR_DISPLAY,
  TIMESTAMP,
} = MOMENT_FORMATS;
