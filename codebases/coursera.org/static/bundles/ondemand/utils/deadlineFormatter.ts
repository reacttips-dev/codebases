import {
  formatDateTimeDisplay,
  momentWithUserTimezone,
  getUserTimezoneAbbr,
  MED_DATETIME_NO_YEAR_DISPLAY,
} from 'js/utils/DateTimeUtils/DateTimeUtils';
import moment from 'moment';

/**
 * Functions that format deadlines in a standard way for display across our UI.
 */

/**
 * Converts a moment date into a moment date with the timezone that we use to show deadlines.
 * @param momentDate must be a moment object.
 */
const deadlineFormatter = {
  toTimezone(momentDate: moment.Moment) {
    return momentWithUserTimezone(momentDate);
  },

  /**
   * Returns the timezone string for the timezone that we use to show deadlines.
   */
  getTimezoneCode() {
    return getUserTimezoneAbbr();
  },

  /**
   * Returns a string describing `deadline`, in the timezone that we use to show deadlines.
   * @param deadline can be a timestamp in milliseconds or a moment object.
   */
  getFormattedDeadline(deadline: number | moment.Moment): string {
    if (deadline) {
      return formatDateTimeDisplay(deadline, MED_DATETIME_NO_YEAR_DISPLAY);
    } else {
      return '';
    }
  },
};

export default deadlineFormatter;

export const { toTimezone, getTimezoneCode, getFormattedDeadline } = deadlineFormatter;
