import moment from 'moment';
import { SHORT_DATE_ONLY_DISPLAY, momentWithUserTimezone } from 'js/utils/DateTimeUtils';
import _t from 'i18n!nls/promotions';

// AoE (Anywhere on Earth) timezone is UTC-12
const AOE_TIMEZONE_OFFSET = 12;

// Converts the user-set endsAt / couponHardExpiry to an AoE timezone-based end of day timestamp
export const formatPromotionExpirationTimestamp = (timestamp: number): number => {
  const currentDate = momentWithUserTimezone(timestamp).format(SHORT_DATE_ONLY_DISPLAY); // get date based on local timezone
  const formattedTimestamp = moment
    .utc(currentDate, SHORT_DATE_ONLY_DISPLAY) // convert date to UTC 00:00:00
    .set({ hour: 23, minute: 59, second: 59, milliseconds: 999 }) // go to UTC 23:59:59
    .add(AOE_TIMEZONE_OFFSET, 'hours') // go to AOE (UTC-12) 23:59:59
    .format('x');

  return Number(formattedTimestamp);
};

// Gets the promotion endsAt / couponHardExpiry date based on the AoE timezone-based timestamp
export const getPromotionExpirationDate = (timestamp?: number | null, format?: string): string => {
  if (!timestamp) {
    return '';
  }
  return moment
    .utc(timestamp)
    .subtract(AOE_TIMEZONE_OFFSET, 'hours')
    .locale(_t.getLocale())
    .format(format || SHORT_DATE_ONLY_DISPLAY);
};
