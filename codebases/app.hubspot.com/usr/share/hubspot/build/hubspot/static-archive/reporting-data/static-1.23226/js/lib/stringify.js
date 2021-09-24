'use es6';

import { Iterable } from 'immutable';

var transformDeep = function transformDeep(value) {
  var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (a) {
    return a;
  };
  return typeof value === 'object' && value != null ? Array.isArray(value) ? value.map(function (v) {
    return transformDeep(v, transform);
  }) : Object.keys(value).reduce(function (o, key) {
    var v = value[key];
    o[key] = transformDeep(v, transform);
    return o;
  }, {}) : transform(value);
};

var sortDeep = function sortDeep(value) {
  return typeof value === 'object' && value != null ? Array.isArray(value) ? value.map(sortDeep) : Object.keys(value).sort().reduce(function (o, key) {
    var v = value[key];
    o[key] = sortDeep(v);
    return o;
  }, {}) : value;
};

export var replaceFunctions = function replaceFunctions(obj, rename) {
  return transformDeep(obj, function (value) {
    return typeof value === 'function' ? rename : value;
  });
};
/**
 * @param {any?} subject - optional
 * @param {[]} args
 * @returns {string?} - optional
 */

export var stableStringify = function stableStringify(subject) {
  var subjectJS = Iterable.isIterable(subject) ? subject.toJS() : subject;

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return JSON.stringify.apply(JSON, [sortDeep(subjectJS)].concat(args));
};