'use es6';

import I18n from 'I18n';
import { getLocaleData } from '../utils/Locale'; // We can't use the `class` keyword here because we need to support instantiation without `new`.

export function SimpleDate(year, month, date) {
  // For backward compatibility, we support `SimpleDate({ year, month, date })`.
  if (typeof year === 'object') {
    var y = year.year,
        m = year.month,
        d = year.date;
    return new SimpleDate(y, m, d);
  }

  if (!(this instanceof SimpleDate)) {
    return new SimpleDate(year, month, date);
  }

  this.year = year;
  this.month = month;
  this.date = date;
}
/**
 * Test if two SimpleDate objects represent the same date.
 *
 * @param  {?SimpleDateRecord}
 * @param  {?SimpleDateRecord}
 * @return {bool}
 */

function _equals(dateA, dateB) {
  if (dateA === dateB) {
    return true;
  }

  if (!dateA || !dateB) {
    return false;
  }

  return dateA.year === dateB.year && dateA.month === dateB.month && dateA.date === dateB.date;
}

export { _equals as equals };

function toJS() {
  return {
    year: this.year,
    month: this.month,
    date: this.date
  };
} // Add legacy support for Immutable-era methods


Object.assign(SimpleDate.prototype, {
  get: function get(key) {
    return this[key];
  },
  equals: function equals(other) {
    return _equals(other, this);
  },
  toJS: toJS,
  toJSON: toJS,
  toString: function toString() {
    return JSON.stringify(this.toJS());
  }
});
export var EmptySimpleDate = new SimpleDate(); // Aliases for backward compatibility

export var SimpleDateRecord = SimpleDate;
export var EmptySimpleDateRecord = EmptySimpleDate;
/**
 * Comparison function suitable for use with the native `sort()` method, e.g.
 * `[dateA, dateB, dateC].sort(compare)`.
 *
 * @param dateA {?SimpleDateRecord}
 * @param dateB {?SimpleDateRecord}
 * @return {int} -1 if `dateA < dateB`, 1 if `dateB < dateA`, 0 if the two are identical
 */

export function compare(dateA, dateB) {
  var keys = ['year', 'month', 'date'];

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];

    if (dateA[key] < dateB[key]) {
      return -1;
    } else if (dateA[key] > dateB[key]) {
      return 1;
    }
  }

  return 0;
}
/**
 * @param {number} year E.g. 2012
 * @param {number} month From 0 to 11 (same as `Date`)
 * @param {number} date From 1 to 31 (same as `Date`)
 * @returns A new `SimpleDate`
 */

export function make(year, month, date) {
  return new SimpleDate(year, month, date);
}
/**
 * @param  {Moment}
 * @return {SimpleDateRecord}
 */

export function fromMoment(moment) {
  if (!moment.isValid()) {
    return EmptySimpleDate;
  }

  return make(moment.get('year'), moment.get('month'), moment.get('date'));
}
/**
 * Converts a pickadate "select" object to a simple date object
 *
 * @param  {Object}
 * @return {SimpleDateRecord}
 */

export function fromPickadate(_ref) {
  var year = _ref.year,
      month = _ref.month,
      date = _ref.date;
  return make(year, month, date);
}
/**
 * Converts a simple date to an array of the form [year, month, date]
 *
 * @param  {SimpleDateRecord}
 * @return {Array}
 */

export function toArray(simpleDate) {
  if (simpleDate == null) {
    return null;
  }

  var year = simpleDate.year,
      month = simpleDate.month,
      date = simpleDate.date;
  return [year, month, date];
}
/**
 * Returns true if a simple date object contains valid data
 *
 * @param  {SimpleDateRecord}
 * @return {bool}
 */

export function isValid(simpleDate) {
  if (simpleDate == null) {
    return false;
  }

  var year = simpleDate.year,
      month = simpleDate.month,
      date = simpleDate.date;
  return typeof year === 'number' && typeof month === 'number' && typeof date === 'number' && I18n.moment([year, month, date]).isValid();
}
/**
 * Returns true if given object contains a valid start and end date and
 * the start date is before or equal to the end date
 *
 * @param  {Object}
 * @return {bool}
 */

export function isValidRange(_ref2) {
  var startDate = _ref2.startDate,
      endDate = _ref2.endDate;
  return isValid(startDate) && isValid(endDate) && compare(startDate, endDate) !== 1;
}
/**
 * Returns a simple date representing the date right now.
 * Analogous to Date.now().
 *
 * @param  {string}     "portalTz", "userTz", or "utc"
 * @return {SimpleDateRecord}
 */

export function now() {
  var constructor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'userTz';
  var momentNow = I18n.moment[constructor]();
  return make(momentNow.year(), momentNow.month(), momentNow.date());
}
/**
 * Return a date from the given string, or `null` if the string doesn't match the given format.
 * Unlike `I18n.moment(str, format)`, this function is strict about the string containing all three
 * parts of a date.
 *
 * @param {string} str
 * @param {string} format
 * @return {?SimpleDateRecord}
 */

export var fromString = function fromString(str, format) {
  var yearMatch = str.match(/\b\d{4}\b/);
  if (!yearMatch) return null;
  var monthAndDateMatches = str.match(/\b(\d{1,2})[^\d](\d{1,2})\b/);
  if (!monthAndDateMatches) return null;
  var year = +yearMatch[0];
  var month;
  var date;
  var dateFormat = getLocaleData()._longDateFormat[format] || format;

  if (dateFormat.indexOf('MM') > dateFormat.indexOf('DD')) {
    month = +monthAndDateMatches[2] - 1;
    date = +monthAndDateMatches[1];
  } else {
    month = +monthAndDateMatches[1] - 1;
    date = +monthAndDateMatches[2];
  }

  var result = new SimpleDate(year, month, date);
  return isValid(result) ? result : null;
};
/**
 * Function for converting a SimpleDateRecord to a Moment
 *
 * @param  {string}     "portalTz", "userTz", or "utc"
 * @param  {SimpleDateRecord}
 * @return {Moment}
 */

export function makeMoment(constructor, simpleDate) {
  return I18n.moment[constructor](toArray(simpleDate));
}
/**
 * Converts a simple date to a Moment object in the user's timezone.
 * Useful for getting to other date representations. e.g.
 *
 * const timestamp = toMoment(date).valueOf();
 * const formattedStr = toMoment(date).format('L');
 *
 * @param  {SimpleDateRecord}
 * @return {Moment}
 */

export var toMoment = function toMoment() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return makeMoment.apply(void 0, ['userTz'].concat(args));
};
/**
 * Like `toMoment`, but returns a Moment in the portal timezone
 * rather than the user's timezone.
 *
 * @param  {SimpleDateRecord}
 * @return {Moment}
 */

export var toMomentPortalTz = function toMomentPortalTz() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return makeMoment.apply(void 0, ['portalTz'].concat(args));
};
/**
 * Like `toMoment`, but returns a Moment in UTC rather than the
 * user's timezone.
 *
 * @param  {SimpleDateRecord}
 * @return {Moment}
 */

export var toMomentUTC = function toMomentUTC() {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return makeMoment.apply(void 0, ['utc'].concat(args));
};
/**
 * Returns a string representing the given `date` in the given `format`.
 *
 * @param {?SimpleDateRecord} value
 * @param {string} format
 * @return {string}
 */

export var toFormattedString = function toFormattedString(date, format) {
  if (date == null) return '';
  if (!isValid(date)) return I18n.text('ui.datePicker.invalidDate');
  return toMoment(date).format(format);
};
/**
 * Returns a simple date representing the date at the start of
 * the given period
 *
 * @param {string}
 * @param {string}     "portalTz", "userTz", or "utc"
 * @return {SimpleDateRecord}
 */

export function startOfThis(period) {
  var constructor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'userTz';
  return fromMoment(I18n.moment[constructor]().startOf(period));
}
/**
 * Returns a simple date representing the date at the end of
 * the given period
 *
 * @param {string}
 * @param {string}     "portalTz", "userTz", or "utc"
 * @return {SimpleDateRecord}
 */

export function endOfThis(period) {
  var constructor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'userTz';
  return fromMoment(I18n.moment[constructor]().endOf(period));
}
/**
 * Returns a simple date representing the date at the start of
 * the period a given number of periods ago
 *
 * @param {string}
 * @param {integer}
 * @return {SimpleDateRecord}
 */

export function startOfPrior(period) {
  var periodsAgo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var constructor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'userTz';
  return fromMoment(I18n.moment[constructor]().subtract(periodsAgo, period).startOf(period));
}
/**
 * Returns a simple date representing the date at the end of
 * the period a given number of periods ago
 *
 * @param {string}
 * @param {integer}
 * @param {string}     "portalTz", "userTz", or "utc"
 * @return {SimpleDateRecord}
 */

export function endOfPrior(period) {
  var periodsAgo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var constructor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'userTz';
  return fromMoment(I18n.moment[constructor]().subtract(periodsAgo, period).endOf(period));
}
/**
 * Returns a simple date representing the date the given number of days
 * before today
 *
 * @param {number}
 * @param {string}     "portalTz", "userTz", or "utc"
 * @return {SimpleDateRecord}
 */

export function daysAgo(numDays) {
  var constructor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'userTz';
  return fromMoment(I18n.moment[constructor]().subtract(numDays, 'days'));
}
/**
 * @param {SimpleDateRecord} simpleDate
 * @return {SimpleDateRecord} The day before the given day
 */

export function prevDay(simpleDate) {
  return fromMoment(toMoment(simpleDate).subtract(1, 'day'));
}
/**
 * @param {SimpleDateRecord} simpleDate
 * @return {SimpleDateRecord} The day after the given day
 */

export function nextDay(simpleDate) {
  return fromMoment(toMoment(simpleDate).add(1, 'day'));
}
/**
 * @param {SimpleDateRecord} simpleDate
 * @return {SimpleDateRecord} The same day (or closest) of the previous month
 */

export function prevMonth(simpleDate) {
  return fromMoment(toMoment(simpleDate).subtract(1, 'month'));
}
/**
 * @param {SimpleDateRecord} simpleDate
 * @return {SimpleDateRecord} The same day (or closest) of the next month
 */

export function nextMonth(simpleDate) {
  return fromMoment(toMoment(simpleDate).add(1, 'month'));
}
/**
 * Returns a simple date representing Jan 1, 2000, a date that should be
 * before any other HubSpot related date
 *
 * @return {SimpleDateRecord}
 */

export function beginningOfTime() {
  return make(2000, 0, 1);
}
/**
 * @param  {Array[?SimpleDate]}
 * @return {SimpleDate} The latest date in the given array
 */

export function maxDate(dates) {
  if (!dates) return null;
  return dates.reduce(function (latestDate, date) {
    return isValid(date) && (!isValid(latestDate) || compare(date, latestDate) === 1) ? date : latestDate;
  }, null);
}
/**
 * @param  {Array[?SimpleDate]}
 * @return {SimpleDate} The earliest date in the given array
 */

export function minDate(dates) {
  if (!dates) return null;
  return dates.reduce(function (earliestDate, date) {
    return isValid(date) && (!isValid(earliestDate) || compare(date, earliestDate) === -1) ? date : earliestDate;
  }, null);
}
/**
 * @param {?SimpleDate} date
 * @param {?SimpleDate} min
 * @param {?SimpleDate} max
 * @returns {?SimpleDate} The date closest to `date` within the bounds set by `min` and `max`.
 */

export function getBoundedDate(date, min, max) {
  if (date == null) return date;
  if (min != null && compare(min, date) === 1) return min;
  if (max != null && compare(max, date) === -1) return max;
  return date;
}
/**
 * @param {?SimpleDate} date
 * @param {?SimpleDate} min
 * @param {?SimpleDate} max
 * @returns {boolean}
 */

export function isDateInRange(date, min, max) {
  return getBoundedDate(date, min, max) === date;
}