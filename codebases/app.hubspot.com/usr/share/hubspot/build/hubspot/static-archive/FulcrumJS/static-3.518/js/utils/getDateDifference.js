'use es6';

import getMomentObjectFromDate from './getMomentObjectFromDate';
import { MILLISECONDS, DAYS, WEEKS, MONTHS, YEARS } from '../constants/dateUnits';
var _allowedDateUnits = [MILLISECONDS, DAYS, WEEKS, MONTHS, YEARS];

var _isAllowedDateUnit = function _isAllowedDateUnit(unit) {
  return _allowedDateUnits.indexOf(unit) >= 0;
};

export default (function (d1, d2) {
  var unit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DAYS;

  if (unit && !_isAllowedDateUnit(unit)) {
    return console.error("The date unit provided \"" + unit + "\" is not allowed. Allowed date units: " + _allowedDateUnits.toString());
  }

  var date1 = getMomentObjectFromDate(d1);
  var date2 = getMomentObjectFromDate(d2);
  var dateDifference = date1.diff(date2, unit); // Moment returns NaN if either date string is invalid

  if (isNaN(dateDifference)) {
    return console.error("One of the date string's provided are invalid. Date 1: " + d1 + " | Date 2: " + d2);
  }

  return dateDifference;
});