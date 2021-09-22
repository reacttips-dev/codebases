import type { Duration } from 'moment';
import _t from 'i18n!nls/page';
import _duration from './duration';
import _humanizeLearningTime from './humanizeLearningTime';

import dateTimeUtils, {
  momentWithUserTimezone,
  formatDateTimeDisplay,
  formatCurrentDateTime,
  getUserTimezone,
  getUserTimezoneAbbr,
  hasEqualUTCOffset,
  DAY,
  DAY_AND_MONTH,
  DATE_COMMON,
  TIME_ONLY_DISPLAY,
  TIMEZONE_ONLY_DISPLAY,
  TIME_ONLY_DISPLAY_NO_TZ,
  SHORT_DATETIME_DISPLAY,
  SHORT_MONTH_DAY_DISPLAY,
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
  MED_DATETIME_DISPLAY_NO_TZ,
  LONG_DATETIME_NO_YEAR_DISPLAY,
  LONG_DATE_ONLY_DISPLAY,
  LONG_MONTH_YEAR_DISPLAY,
  TIME_ONLY_COMMON,
  TIME_ONLY_CONDENSED,
  LONG_DATE_ONLY_NO_YEAR_DISPLAY,
  LONG_DATE_AT_TIME_DISPLAY,
  TIMESTAMP,
  MOMENT_FORMATS,
} from './DateTimeUtils';
import type { MomentFormat } from './DateTimeUtils';

export default dateTimeUtils;

const currentLocale = () => _t.getLocale();
const duration = (time: number, formatString: string) => _duration.locale(currentLocale())(time, formatString);
const humanizeLearningTime = (inputMilliseconds: Duration | number, displayFullUnit?: boolean) =>
  _humanizeLearningTime(currentLocale(), inputMilliseconds, displayFullUnit);

export {
  momentWithUserTimezone,
  formatDateTimeDisplay,
  formatCurrentDateTime,
  getUserTimezone,
  getUserTimezoneAbbr,
  hasEqualUTCOffset,
  DAY,
  DAY_AND_MONTH,
  DATE_COMMON,
  TIME_ONLY_DISPLAY,
  TIMEZONE_ONLY_DISPLAY,
  TIME_ONLY_DISPLAY_NO_TZ,
  SHORT_DATETIME_DISPLAY,
  SHORT_MONTH_DAY_DISPLAY,
  SHORT_DATE_ONLY_DISPLAY,
  SHORT_DATETIME_DISPLAY_SECONDS,
  SHORT_DATETIME_DISPLAY_WITHOUT_TIMEZONE,
  SHORT_WEEKDAY,
  SHORT_WEEKDAY_DISPLAY,
  WEEK_DAY_TIME_ONLY,
  MED_DATE_ONLY_DISPLAY,
  MED_DATETIME_DISPLAY,
  MED_TIMEDATE_DISPLAY,
  MED_DATETIME_DISPLAY_NO_TZ,
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
  MOMENT_FORMATS,
  duration,
  humanizeLearningTime,
};

export type { MomentFormat };
