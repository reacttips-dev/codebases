'use es6'; // Importing here and re-exporting helps us get around the spying-default-exports-in-Jasmine problem

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import reactUtilsDebounce from 'react-utils/debounce'; // Functions below are from underscore
// https://github.com/jashkenas/underscore/blob/master/underscore.js

export function shuffle(inputArray) {
  var outputArray = _toConsumableArray(inputArray);

  for (var i = outputArray.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = outputArray[i];
    outputArray[i] = outputArray[j];
    outputArray[j] = temp;
  }

  return outputArray;
}

function objectFilter(object, include) {
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
}

export function omit(object) {
  for (var _len2 = arguments.length, filters = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    filters[_key2 - 1] = arguments[_key2];
  }

  return objectFilter.apply(void 0, [object, false].concat(filters));
}
export function pick(object) {
  for (var _len3 = arguments.length, filters = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    filters[_key3 - 1] = arguments[_key3];
  }

  return objectFilter.apply(void 0, [object, true].concat(filters));
}
export function last(list) {
  return list == null || list.length === 0 ? undefined : list[list.length - 1];
}
export function once(func) {
  var _this = this;

  var ran;
  var result;
  return function () {
    if (ran) {
      return result;
    }

    ran = true;

    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    result = func.apply.apply(func, [_this].concat(args));
    return result;
  };
}
export function isUndefined(value) {
  return typeof value === 'undefined';
}
export function isFunction(value) {
  return typeof value === 'function';
}
export function without(list, blacklist) {
  return list.filter(function (element) {
    return !blacklist.includes(element);
  });
}
export function memoize(func) {
  var hasher = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (args) {
    return JSON.stringify(args);
  };

  var memoized = function memoized() {
    var cache = memoized.cache;

    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    var address = "" + hasher.apply(this, args); // eslint-disable-next-line no-prototype-builtins

    if (!cache.hasOwnProperty(address)) cache[address] = func.apply(this, args);
    return cache[address];
  };

  memoized.cache = {};
  return memoized;
}
export var debounce = reactUtilsDebounce;
export function getParameter() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var value = params[key];

  if (opts.indexOf(value) === -1) {
    return opts[0];
  }

  return value;
}