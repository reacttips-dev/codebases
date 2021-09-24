'use es6';

import I18n from 'I18n';
import { MOMENT_TYPES } from 'UIComponents/constants/MomentTypes';
import compose from 'transmute/compose';
export var getDurationText = function getDurationText(duration) {
  var hourLabel = I18n.text('time.hour');
  var hoursLabel = I18n.text('time.hours');
  var hourValue = duration.get('hours');
  var hoursText = hourValue === 1 ? hourValue + " " + hourLabel : hourValue + " " + hoursLabel;
  var minutesLabel = I18n.text('time.minutes');
  var minuteValue = duration.get('minutes');
  var minutesText = minuteValue + " " + minutesLabel;

  if (hourValue > 0 && minuteValue > 0) {
    return hoursText + " " + minutesText;
  } else if (hourValue > 0) {
    return "" + hoursText;
  } else {
    return "" + minutesText;
  }
}; // September 26, 2019 at 10:30 AM EDT

export var formatDateAtTimeString = function formatDateAtTimeString(momentTimestamp) {
  var date = momentTimestamp.format('LL');
  var time = momentTimestamp.format('LT z');
  return I18n.text('calendar.other', {
    time: time,
    date: date
  });
}; // Sep 26 at 10:30am EDT

export var formatMonthDayAtTimeString = function formatMonthDayAtTimeString(timestamp) {
  return I18n.text('calendar.other', {
    date: I18n.moment.userTz(timestamp).format('MMM D'),
    time: I18n.moment.userTz(timestamp).format('LT z')
  });
}; // Sep 26, 2019 at 10:30am EDT

export var formatMonthDayYearAtTimeString = function formatMonthDayYearAtTimeString(timestamp) {
  return I18n.text('calendar.other', {
    date: I18n.moment.userTz(timestamp).format('ll'),
    time: I18n.moment.userTz(timestamp).format('LT z')
  });
}; // Wednesday, September 26, 2019 at 10:30am EDT

export var formatTooltipString = function formatTooltipString(timestamp) {
  return I18n.text('calendar.other', {
    date: I18n.moment.userTz(timestamp).format('dddd, LL'),
    time: I18n.moment.userTz(timestamp).format('LT z')
  });
}; // 9/26/2019 at 10:30 AM EDT

export var formatTableDateString = function formatTableDateString(momentTimestamp) {
  var date = momentTimestamp.format('l');
  var time = momentTimestamp.format('LT z');
  return I18n.text('calendar.other', {
    time: time,
    date: date
  });
};
export var getTimeInDayInMilliseconds = function getTimeInDayInMilliseconds(val) {
  return I18n.moment(val).diff(I18n.moment(val).startOf('day'));
};
export var formatUTCtoLocalTimestamp = function formatUTCtoLocalTimestamp(timestamp) {
  if (!Number.isInteger(timestamp)) {
    timestamp = +timestamp;
  }

  var utcMoment = I18n.moment.utc(timestamp);
  return I18n.moment(utcMoment.toArray().slice(0, 3)).valueOf();
};
export var minutesToSeconds = function minutesToSeconds(minutes) {
  return minutes * 60;
};
export var hoursToMinutes = function hoursToMinutes(hours) {
  return hours * 60;
};
export var secondsToMilliseconds = function secondsToMilliseconds(seconds) {
  return seconds * 1000;
};
export var millisecondsToSeconds = function millisecondsToSeconds(milliseconds) {
  return milliseconds / 1000;
};
export var secondsToMinutes = function secondsToMinutes(seconds) {
  return seconds / 60;
};
export var toTimestamp = function toTimestamp(dateObj) {
  if (dateObj._isAMomentObject) {
    return dateObj.valueOf();
  } else if (Object.prototype.toString.call(dateObj) === '[object Date]') {
    return dateObj.getTime();
  }

  return null;
};
export var getMoment = function getMoment(value, momentType) {
  if (!momentType) {
    momentType = MOMENT_TYPES.USER;
  }

  if (!value) {
    value = Date.now();
  }

  switch (momentType) {
    case MOMENT_TYPES.PORTAL:
      return I18n.moment.portalTz(value);

    case MOMENT_TYPES.USER:
      return I18n.moment.userTz(value);

    case MOMENT_TYPES.MOMENT:
      return I18n.moment(value);

    default:
      return null;
  }
};
export var getNextTimeInterval = function getNextTimeInterval(timestamp, interval) {
  interval = interval || 15;
  var nextInterval = Math.ceil(getMoment(timestamp).minute() / interval) * interval;
  return getMoment(timestamp).startOf('hour').add(nextInterval, 'minutes');
};
export var timeGreaterThanOneDay = function timeGreaterThanOneDay(val) {
  var msInOneDay = compose(secondsToMilliseconds, minutesToSeconds, hoursToMinutes)(24);
  return val > msInOneDay;
}; // gets the difference in days from today.
// yesterday = -1, today = 0, tomorrow = 1, etc.

export var getDaysFromToday = function getDaysFromToday(value) {
  var startOfToday = I18n.moment().startOf('day');
  var startOfDate = I18n.moment(value).startOf('day');
  var daysDiff = startOfDate.diff(startOfToday, 'days');
  return daysDiff;
};
export var getDaysFromTodayUTCToUserTz = function getDaysFromTodayUTCToUserTz(value) {
  var startOfToday = I18n.moment().startOf('day');
  var startOfDate = I18n.moment(formatUTCtoLocalTimestamp(value)).startOf('day');
  var daysDiff = startOfDate.diff(startOfToday, 'days');
  return daysDiff;
};
export var addWeekdays = function addWeekdays(momentDate, days) {
  while (days > 0) {
    momentDate = momentDate.add(1, 'days');

    if (momentDate.isoWeekday() !== 6 && momentDate.isoWeekday() !== 7) {
      days -= 1;
    }
  }

  return momentDate;
};
export var getRecentRelativeString = function getRecentRelativeString(value) {
  var useUserTz = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var days = {
    '-1': 'yesterday',
    '0': 'today',
    '1': 'tomorrow'
  };
  var dayDiff = useUserTz ? getDaysFromTodayUTCToUserTz(value) : getDaysFromToday(value);

  if (dayDiff > 1 || dayDiff < -1) {
    return false;
  }

  return I18n.text("calendar." + days[dayDiff]);
};
/**
 * Return true for 'datetime' type timestamps
 * that are before the current time
 *
 * @param {String} type
 * @param {number} value
 */

export var isTimestampInThePast = function isTimestampInThePast(type, value) {
  if (type !== 'datetime') {
    return false;
  }

  var taskDate = I18n.moment.userTz(value);
  var now = I18n.moment.userTz();
  return taskDate.isBefore(now);
};
/**
 * Returns a timestamp representing the current wall clock time on the
 * given date in the current user's timezone.
 *
 * See also
 * - https://git.hubteam.com/HubSpot/CRM-Issues/issues/3417
 * - https://git.hubteam.com/HubSpot/CRM/pull/11184
 * - https://git.hubteam.com/HubSpot/CRM/pull/16323
 *
 * @param {number} date timestamp representing the start of a day (00:00) in the user's timezone
 * @return {number} timestamp representing the user's current time on the given day
 */

export var getCurrentTimeOnDate = function getCurrentTimeOnDate(date) {
  if (!date) {
    return date;
  }

  var startOfDay = I18n.moment.userTz().startOf('day').valueOf();
  var currentTime = I18n.moment.userTz().valueOf();
  var timeOffset = currentTime - startOfDay;
  return I18n.moment.userTz(date).add(timeOffset).valueOf();
};
/**
 * Utility for use in UIDatePicker components when the user or Selenium inputs
 * the date manually in the HTML input field instead of the UI calender popover.
 * When the user is actively typing, the UIDatePicker will fire onChange events
 * for each character, which can then include incomplete dates and years (e.g.
 * "01/01/201" on the way to "01/01/2019") which leads to inconsistent behavior.
 * Dates have a +- 1000 year check enforced on the back end.
 * @param {number} timestamp timestamp to validate
 * @return {boolean} if the date is +- 1000 years from now
 */

export var isValidDate = function isValidDate(timestamp) {
  // null is valid as it is used to clear the value in a date picker, see https://git.hubteam.com/HubSpot/CRM/pull/19274
  if (!timestamp) return [null, 0, undefined].includes(timestamp);
  var momentObj = I18n.moment.userTz(timestamp).valueOf();
  var pastLimit = I18n.moment.userTz().subtract(1000, 'years').valueOf();
  var futureLimit = I18n.moment.userTz().add(1000, 'years').valueOf();
  return momentObj > pastLimit && momentObj < futureLimit;
};