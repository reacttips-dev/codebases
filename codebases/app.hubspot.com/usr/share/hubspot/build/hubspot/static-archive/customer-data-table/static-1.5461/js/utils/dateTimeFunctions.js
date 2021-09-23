'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import I18n from 'I18n';
import invariant from 'react-utils/invariant';
import isNumber from 'transmute/isNumber';
export function getPortalTz() {
  return I18n.moment.portalTz().format('z');
}
export function getUserTz() {
  return I18n.moment.userTz().format('z');
}
export var isInPortalTz = function isInPortalTz() {
  return getPortalTz() === getUserTz();
};
export var getDiff = function getDiff(from, to) {
  return I18n.moment.duration(Math.abs(to.diff(from))).asDays();
};

var getDateForValueInUserTz = function getDateForValueInUserTz(value, type) {
  var dateArrayForValue = I18n.moment[type](value).toArray() // makes an array of format [YEAR, MONTH, DAY, HOUR, MIN, SEC, MILSEC]
  .slice(0, 3); // get just the YEAR, MONTH, DAY of the value

  return I18n.moment.userTz(dateArrayForValue); // get the timestamp for 00:00:00 at that date in the user's timezone
};

export var getDaysFromToday = function getDaysFromToday(value, type) {
  var startOfTodayUserTz = I18n.moment.userTz().startOf('day'); // moment object for today at 00:00:00 at that date in the user's tz

  var startOfDayForValueUserTz = getDateForValueInUserTz(value, type); // moment object for 00:00:00 of the start of the DATE supplied in value

  var diff = startOfDayForValueUserTz.diff(startOfTodayUserTz, 'days'); // get value - today for user tz

  return diff;
};
export var getRecentRelativeString = function getRecentRelativeString(value, type) {
  var days = {
    '-1': 'yesterday',
    '0': 'today',
    '1': 'tomorrow'
  };
  var dayDiff = getDaysFromToday(value, type);

  if (dayDiff > 1 || dayDiff < -1 || !isNumber(dayDiff)) {
    return false;
  }

  return I18n.text("customerDataTable.cells.datetime." + days[dayDiff]);
};
export var getDateLabel = function getDateLabel(value) {
  var showTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var type = arguments.length > 2 ? arguments[2] : undefined;
  invariant(type, 'type is required');
  var recentDate = getRecentRelativeString(value, type);

  if (recentDate && showTime) {
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "customerDataTable.cells.datetime.relativeTime",
      options: {
        day: recentDate,
        time: I18n.moment.userTz(value).format('LT')
      }
    });
  } else if (recentDate) {
    return recentDate;
  }

  return null;
};