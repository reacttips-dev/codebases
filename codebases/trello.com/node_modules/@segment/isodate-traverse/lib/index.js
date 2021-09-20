'use strict';

var type = require('component-type');
var each = require('component-each');
var isodate = require('@segment/isodate');

/**
 * Expose `traverse`.
 */

module.exports = traverse;

/**
 * Traverse an object or array, and return a clone with all ISO strings parsed
 * into Date objects.
 *
 * @param {Object} obj
 * @return {Object}
 */

function traverse(input, strict) {
  if (strict === undefined) strict = true;

  if (type(input) === 'object') return object(input, strict);
  if (type(input) === 'array') return array(input, strict);
  return input;
}

/**
 * Object traverser.
 *
 * @param {Object} obj
 * @param {Boolean} strict
 * @return {Object}
 */

function object(obj, strict) {
  // 'each' utility uses obj.length to check whether the obj is array. To avoid incorrect classification, wrap call to 'each' with rename of obj.length
  if (obj.length && typeof obj.length === 'number' && !(obj.length - 1 in obj)) { // cross browser compatible way of checking has length and is not array
    obj.lengthNonArray = obj.length;
    delete obj.length;
  }
  each(obj, function(key, val) {
    if (isodate.is(val, strict)) {
      obj[key] = isodate.parse(val);
    } else if (type(val) === 'object' || type(val) === 'array') {
      traverse(val, strict);
    }
  });
  // restore obj.length if it was renamed
  if (obj.lengthNonArray) {
    obj.length = obj.lengthNonArray;
    delete obj.lengthNonArray;
  }
  return obj;
}

/**
 * Array traverser.
 *
 * @param {Array} arr
 * @param {Boolean} strict
 * @return {Array}
 */

function array(arr, strict) {
  each(arr, function(val, x) {
    if (type(val) === 'object') {
      traverse(val, strict);
    } else if (isodate.is(val, strict)) {
      arr[x] = isodate.parse(val);
    }
  });
  return arr;
}
