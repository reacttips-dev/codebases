'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isArray = exports.isArray = function isArray(arr) {
  return Array.isArray(arr);
};

var isPlainObject = exports.isPlainObject = function isPlainObject(obj) {
  var isObject = (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null && !isArray(obj);
  if (!isObject || obj.toString && obj.toString() !== '[object Object]') return false;
  var proto = Object.getPrototypeOf(obj);
  if (proto === null) {
    return true;
  }
  var Ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor === 'function' && Ctor instanceof Ctor && Function.prototype.toString.call(Ctor) === Function.prototype.toString.call(Object);
};

var findKey = exports.findKey = function findKey(obj, fn) {
  if (!isPlainObject(obj) && !isArray(obj)) return;

  var keys = Object.keys(obj);
  return keys.find(function (key) {
    return fn(obj[key]);
  });
};

var compact = exports.compact = function compact(arr) {
  return arr.filter(Boolean);
};

var flattenOnce = function flattenOnce(arr) {
  var recurse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  return arr.reduce(function (acc, val) {
    if (isArray(val) && recurse) return acc.concat(flattenOnce(val, false));
    acc.push(val);
    return acc;
  }, []);
};

var flatten = exports.flatten = function flatten(arr) {
  if (!isArray(arr)) throw new Error('flatten expects an array');
  return flattenOnce(arr);
};

var map = exports.map = function map(itr, fn) {
  if (isArray(itr)) return itr.map(fn);

  var results = [];
  var keys = Object.keys(itr);
  var len = keys.length;
  for (var i = 0; i < len; i += 1) {
    var key = keys[i];
    results.push(fn(itr[key], key));
  }

  return results;
};