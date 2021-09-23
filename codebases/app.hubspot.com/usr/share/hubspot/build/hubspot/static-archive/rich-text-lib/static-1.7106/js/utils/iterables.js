'use es6';

import invariant from 'react-utils/invariant';
export function curry(fn) {
  return function () {
    for (var _len = arguments.length, xs = new Array(_len), _key = 0; _key < _len; _key++) {
      xs[_key] = arguments[_key];
    }

    invariant(xs.length > 0, 'Empty Invocation');

    if (xs.length >= fn.length) {
      return fn.apply(void 0, xs);
    }

    return curry(fn.bind.apply(fn, [null].concat(xs)));
  };
}
export var identity = function identity(value) {
  return value;
};
export function compose() {
  for (var _len2 = arguments.length, fns = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fns[_key2] = arguments[_key2];
  }

  return fns.reduceRight(function (prevFn, nextFn) {
    return function () {
      return nextFn(prevFn.apply(void 0, arguments));
    };
  }, identity);
}
export var deepCompare = function deepCompare(valA, valB) {
  if (typeof valA !== 'object' || typeof valB !== 'object' || valA === null || valB === null) {
    return valA === valB;
  }

  var aProps = Object.getOwnPropertyNames(valA);
  var bProps = Object.getOwnPropertyNames(valB);

  if (aProps.length !== bProps.length) {
    return false;
  }

  for (var index = 0; index < aProps.length; index++) {
    var propName = aProps[index];

    if (!deepCompare(valA[propName], valB[propName])) {
      return false;
    }
  }

  return true;
};
/**
 * Keep the whitelisted keys of the object
 *
 * @param {Array}  keys Array of keys to pick
 * @param {Object} obj  Object to filter
 *
 * @return {Object}
 */

var _pick = function _pick(keys, obj) {
  invariant(Array.isArray(keys), 'keys must be an Array');
  var result = {};
  keys.forEach(function (key) {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export var pick = curry(_pick);
/**
 * Filter out the blacklisted keys from the object
 *
 * @param {Array}  keys Array of keys to omit
 * @param {Object} obj  Object to filter
 *
 * @return {Object}
 */

var _omit = function _omit(keys, obj) {
  invariant(Array.isArray(keys), 'keys must be an Array');
  var result = {};
  var index = {};
  keys.forEach(function (key) {
    index[key] = 1;
  });
  Object.keys(obj).forEach(function (key) {
    if (!index[key]) {
      result[key] = obj[key];
    }
  });
  return result;
};

export var omit = curry(_omit);

var _path = function _path(paths, obj) {
  var val = obj;
  var idx = 0;

  while (idx < paths.length) {
    if (typeof val === 'undefined' || val === null) {
      return undefined;
    }

    val = val[paths[idx]];
    idx += 1;
  }

  return val;
};

export var path = curry(_path);
/**
 * Map over an object and apply a function to each value
 *
 * @param {Function} iteratee The iterator func to apply to each (value, key) pair
 * @param {Object}   obj      The object to map over
 *
 * @return {Object}
 */

var _mapObject = function _mapObject(iteratee) {
  var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Object.keys(obj).reduce(function (acc, key) {
    acc[key] = iteratee(obj[key], key);
    return acc;
  }, {});
};

export var mapObject = curry(_mapObject);
/**
 * Creates a function that, when called more than one time, returns the result
 * of the original function call
 *
 * @param {Function} func    The function to limit to a single call
 * @param {Object}   context The context for the function application
 *
 * @return {Function}
 */

export var once = function once(func, context) {
  var result;
  var count = 1;
  return function () {
    if (count > 0) {
      count--;

      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      result = func.apply(context, args);
    }

    return result;
  };
};
/**
 * Utils for escape and unescape
 */

var charRegex = /[&<>"'`]/g;
var escapedCharRegex = /&(?:amp|lt|gt|quot|#39|#96);/g;
var charEscapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;'
};
var escapedCharMap = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#96;': '`'
};

var escapeChar = function escapeChar(char) {
  return charEscapeMap[char];
};

var unescapeChar = function unescapeChar(char) {
  return escapedCharMap[char];
};
/**
 * Replaces the characters
 * '&', '<', '>', '"', "'", and '`' in the string
 * with their corresponding HTML entities
 *
 * @param {String} string Phrase to escape
 *
 * @return {String}
 */


export var escape = function escape(string) {
  return charRegex.test(string) ? string.replace(charRegex, escapeChar) : string;
};
/**
 * Replaces the HTML entities
 * '&amp;', '&lt;', '&gt;', '&quot;', '&#39;', and '&#96;' in ther string
 * with their corresponding characters
 *
 * @param {String} string Phrase to unescape
 *
 * @return {String}
 */

export var unescape = function unescape(string) {
  return escapedCharRegex.test(string) ? string.replace(escapedCharRegex, unescapeChar) : string;
};
/**
 * Creates an object whose keys are the group ids and values are subsets of
 * [items], where the group ids are values returned from passing each item
 * into the [iteratee] function
 *
 * @param {Function} iteratee Function whose return value is used as a group id
 * @param {Array}    items    Array of items to group
 *
 * @return {Object}
 */

var _groupBy = function _groupBy(iteratee, items) {
  invariant(Array.isArray(items), 'items must be an Array');
  var result = {};
  items.forEach(function (item) {
    var index = iteratee(item);

    if (result[index]) {
      result[index].push(item);
    } else {
      result[index] = [item];
    }
  });
  return result;
};

export var groupBy = curry(_groupBy);