'use es6';

import { now, compare, equals as _equals, startOfThis, startOfPrior, endOfPrior, daysAgo, beginningOfTime, makeMoment, fromMoment } from '../core/SimpleDate';
import { RANGE_TYPES, RANGE_PERIODS } from '../core/SimpleDateRangeConstants';

var dateToJS = function dateToJS(date) {
  if (!date) return date;
  return date.toJS ? date.toJS() : date;
}; // We can't use the `class` keyword here because we need to support instantiation without `new`.


export function SimpleDateRange() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!(this instanceof SimpleDateRange)) {
    return new SimpleDateRange(obj);
  }

  var _obj$type = obj.type,
      type = _obj$type === void 0 ? null : _obj$type,
      _obj$startDate = obj.startDate,
      startDate = _obj$startDate === void 0 ? null : _obj$startDate,
      _obj$endDate = obj.endDate,
      endDate = _obj$endDate === void 0 ? null : _obj$endDate;
  this.type = type;
  this.startDate = startDate;
  this.endDate = endDate;
}

function toJS() {
  return {
    type: this.type,
    startDate: dateToJS(this.startDate),
    endDate: dateToJS(this.endDate)
  };
} // Add legacy support for Immutable-era methods


Object.assign(SimpleDateRange.prototype, {
  get: function get(key) {
    return this[key];
  },
  equals: function equals(other) {
    return other.type === this.type && _equals(other.startDate, this.startDate) && _equals(other.endDate, this.endDate);
  },
  toJS: toJS,
  toJSON: toJS
});
var EmptySimpleDateRange = new SimpleDateRange(); // Aliases for backward compatibility

export var SimpleDateRangeRecord = SimpleDateRange;
export var EmptySimpleDateRangeRecord = EmptySimpleDateRange;
/**
 * @param {Object} obj An object of the form `{ type, startDate, endDate }`
 * @returns A new `SimpleDateRange`
 */

export function make(obj) {
  return SimpleDateRange(obj);
}
/**
 * Create a new SimpleDateRangeRecord based on the given type
 * with the proper date values initialized
 *
 * @param  {SimpleDateRangeRecord}
 * @param {string}     "portalTz", "userTz", or "utc"
 * @return {SimpleDateRangeRecord}
 */

export var makeDateRangeByType = function makeDateRangeByType(range) {
  var constructor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'userTz';
  var type = range.type;

  switch (type) {
    case RANGE_TYPES.ALL:
      return make({
        type: type,
        startDate: beginningOfTime(),
        endDate: now(constructor)
      });

    case RANGE_TYPES.THIS_DAY:
      return make({
        type: type,
        startDate: now(constructor),
        endDate: now(constructor)
      });

    case RANGE_TYPES.LAST_DAY:
      return make({
        type: type,
        startDate: daysAgo(1, constructor),
        endDate: daysAgo(1, constructor)
      });

    case RANGE_TYPES.THIS_WEEK:
      return make({
        type: type,
        startDate: startOfThis('week', constructor),
        endDate: now(constructor)
      });

    case RANGE_TYPES.LAST_WEEK:
      return make({
        type: type,
        startDate: startOfPrior('week', 1, constructor),
        endDate: endOfPrior('week')
      });

    case RANGE_TYPES.THIS_MONTH:
      return make({
        type: type,
        startDate: startOfThis('month', constructor),
        endDate: now(constructor)
      });

    case RANGE_TYPES.LAST_MONTH:
      return make({
        type: type,
        startDate: startOfPrior('month', 1, constructor),
        endDate: endOfPrior('month')
      });

    case RANGE_TYPES.LAST_THIRTY_DAYS:
      return make({
        type: type,
        // 29 days ago + today
        startDate: daysAgo(29, constructor),
        endDate: now(constructor)
      });

    case RANGE_TYPES.LAST_THREE_MONTHS:
      return make({
        type: type,
        startDate: startOfPrior('month', 2, constructor),
        endDate: now(constructor)
      });

    case RANGE_TYPES.THIS_QUARTER:
      return make({
        type: type,
        startDate: startOfThis('quarter', constructor),
        endDate: now(constructor)
      });

    case RANGE_TYPES.LAST_QUARTER:
      return make({
        type: type,
        startDate: startOfPrior('quarter', 1, constructor),
        endDate: endOfPrior('quarter', 1, constructor)
      });

    case RANGE_TYPES.THIS_YEAR:
      return make({
        type: type,
        startDate: startOfThis('year', constructor),
        endDate: now(constructor)
      });

    case RANGE_TYPES.LAST_YEAR:
      return make({
        type: type,
        startDate: startOfPrior('year', 1, constructor),
        endDate: endOfPrior('year', 1, constructor)
      });

    default:
      return make(Object.assign({}, range));
  }
};
/**
 * Test whether a given date is contained by the given range.
 *
 * @param  {SimpleDateRangeRecord}
 * @param  {SimpleDateRecord}
 * @return {boolean}
 */

export function contains(range, date) {
  if (compare(range.startDate, date) < 1 && compare(range.endDate, date) > -1) {
    return true;
  }

  return false;
}
/**
 * Create an array of SimpleDates for a given SimpleDateRangeRecord
 * and time period for a given Moment type
 *
 * @param  {SimpleDateRangeRecord}
 * @param  {string}
 * @param  {string}     "portalTz", "userTz", or "utc" - default is "userTz"
 * @return {Array<SimpleDateRecord>}
 */

export function splitDateRange(range, period) {
  var constructor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'userTz';
  var unit = 'day';

  if (period === RANGE_PERIODS.WEEK) {
    unit = 'week';
  } else if (period === RANGE_PERIODS.MONTH) {
    unit = 'month';
  }

  var start = makeMoment(constructor, range.startDate);
  var end = makeMoment(constructor, range.endDate);
  var dates = [];

  function addDate() {
    dates.push(fromMoment(start));
    start.add(1, unit);
  }

  addDate();

  while (start.isBefore(end) || start.isSame(end)) {
    addDate();
  }

  return dates;
}