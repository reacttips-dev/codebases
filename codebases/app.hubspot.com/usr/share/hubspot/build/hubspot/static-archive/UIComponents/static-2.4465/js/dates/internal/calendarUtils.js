'use es6';

import { isValid } from '../../core/SimpleDate';
/**
 * @param {SimpleDate} date
 * @returns {Object} An object of the form { year, month }
 */

export var getPageFromDate = function getPageFromDate(date) {
  if (!isValid(date)) return null;
  return {
    year: date.year,
    month: date.month
  };
};
/**
 * @param {Object} calendarPage An object of the form `{ year, month }`
 * @returns {Object} An object of the form `{ year, month }` for the previous month
 */

export var prevCalendarPage = function prevCalendarPage(_ref) {
  var month = _ref.month,
      year = _ref.year;
  var newMonth = (month + 11) % 12;
  var newYear = newMonth === month - 1 ? year : year - 1;
  return {
    month: newMonth,
    year: newYear
  };
};
/**
 * @param {Object} calendarPage An object of the form `{ year, month }`
 * @returns {Object} An object of the form `{ year, month }` for the next month
 */

export var nextCalendarPage = function nextCalendarPage(_ref2) {
  var month = _ref2.month,
      year = _ref2.year;
  var newMonth = (month + 1) % 12;
  var newYear = newMonth === month + 1 ? year : year + 1;
  return {
    month: newMonth,
    year: newYear
  };
};