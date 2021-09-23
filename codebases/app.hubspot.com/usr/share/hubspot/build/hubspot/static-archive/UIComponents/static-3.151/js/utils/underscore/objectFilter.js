'use es6';
/**
 * Instead of implementing this utility directly, use either the ./pick or ./omit utilities which implement this one.
 * Those utilities are designed to mimic the functionality of _.pick and _.omit.
 * @param {Object} object - object to run filters on
 * @param {Boolean} include - true if the filters should include properties of the object on the returned value.
 *                            false if it should exclude them from the returned value.
 * @param {String|String[]} filters - property name or names to include/exclude
 */

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";

var objectFilter = function objectFilter(object, include) {
  if (object == null) return object;

  for (var _len = arguments.length, filters = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    filters[_key - 2] = arguments[_key];
  }

  var filtersAsArray = filters.reduce(function (filterAccum, filter) {
    if (typeof filter === 'string') {
      return [].concat(_toConsumableArray(filterAccum), [filter]);
    }

    return [].concat(_toConsumableArray(filterAccum), _toConsumableArray(filter));
  }, []);
  return Object.keys(object).reduce(function (prev, key) {
    var passesFilter = include ? Object.assign({}, prev, _defineProperty({}, key, object[key])) : prev;
    var failsFilter = include ? prev : Object.assign({}, prev, _defineProperty({}, key, object[key]));
    return filtersAsArray.includes(key) ? passesFilter : failsFilter;
  }, {});
};

export default objectFilter;