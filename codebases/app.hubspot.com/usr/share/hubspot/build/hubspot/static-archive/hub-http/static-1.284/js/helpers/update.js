"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setIf = exports.setIn = exports.push = exports.set = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _freeze = _interopRequireDefault(require("./freeze"));

// Typeof helper required since removed from default babel transforms in https://git.hubteam.com/HubSpot/asset-bender-hubspot/pull/2390
// via https://github.com/babel/babel/blob/afb0f489debfaffc51dff5b61ab9dd5ffc91be64/packages/babel-helpers/src/helpers.js#L14-L28

/* eslint-disable no-func-assign */
function _typeof(obj) {
  '@babel/helpers - typeof';

  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(objA) {
      return typeof objA;
    };
  } else {
    _typeof = function _typeof(objA) {
      return objA && typeof Symbol === 'function' && objA.constructor === Symbol && objA !== Symbol.prototype ? 'symbol' : typeof objA;
    };
  }

  return _typeof(obj);
}
/* eslint-enable no-func-assign */


var set = function set(name, value) {
  return function (obj) {
    obj = Object.assign({}, obj);
    obj[name] = value;
    return obj;
  };
};

exports.set = set;

var push = function push(name, value) {
  return function (obj) {
    return set(name, [].concat((0, _toConsumableArray2.default)(obj[name] || []), [value]))(obj);
  };
};

exports.push = push;

var defaultForPath = function defaultForPath(path) {
  return typeof path[0] === 'string' || path[0] instanceof String || _typeof(path[0]) === 'symbol' ? (0, _freeze.default)({}) : (0, _freeze.default)([]);
};

var setIn = function setIn(path, value) {
  return function () {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultForPath(path);
    return path.length === 1 ? set(path[0], value)(obj) : set(path[0], setIn(path.slice(1), value)(obj[path[0]]))(obj);
  };
};

exports.setIn = setIn;

var resolvePredicate = function resolvePredicate(predicate, options) {
  return typeof predicate === 'function' ? predicate(options) : predicate;
};

var getValue = function getValue(v) {
  return typeof v === 'function' ? v() : v;
};

var setIf = function setIf(predicate, propertyName, valueOrFn) {
  return function (obj) {
    return resolvePredicate(predicate, obj) ? set(propertyName, getValue(valueOrFn))(obj) : obj;
  };
};

exports.setIf = setIf;