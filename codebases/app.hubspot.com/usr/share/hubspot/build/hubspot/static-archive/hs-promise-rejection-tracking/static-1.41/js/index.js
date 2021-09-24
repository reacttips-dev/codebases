"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.disableRejectionTracking = exports.enableRejectionTracking = void 0;
var enabled = false;
var timeout = 250;

var typeOfReason = function typeOfReason(reason) {
  return reason === null ? 'Null' : reason === undefined ? 'Undefined' : Object.prototype.toString.call(reason).slice(8, -1);
}; // eslint-disable-next-line no-restricted-globals


var rejections = new WeakMap(); // eslint-disable-next-line no-restricted-globals

var timeoutIds = new Set([]);

var sendAlerts = function sendAlerts(reason) {
  var Raven = require('Raven');

  var ravenOpts = {
    tags: {
      isUnhandledPromiseRejection: true
    }
  };

  if (typeof reason === 'string') {
    Raven.captureMessage(reason, ravenOpts);
  } else {
    Raven.captureException(reason, ravenOpts);
  }

  if (window.newrelic) {
    window.newrelic.noticeError(reason, {
      isUnhandledPromiseRejection: true,
      typeOfReason: typeOfReason(reason)
    });
  }
};

var isObject = function isObject(it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var handleUnhandledRejection = function handleUnhandledRejection(e) {
  e.preventDefault();
  var promise = e.promise;
  var reason = e.reason;

  if (isObject(promise)) {
    var timeoutId = setTimeout(function () {
      console.error('Unhandled Promise Rejection', reason);
      sendAlerts(reason, 'unhandled');
    }, timeout);
    timeoutIds.add(timeoutId);
    rejections.set(promise, {
      reason: reason,
      timeoutId: timeoutId
    });
  }
};

var handleRejectionHandled = function handleRejectionHandled(e) {
  var promise = e.promise;

  if (isObject(promise) && rejections.has(promise)) {
    var _rejections$get = rejections.get(promise),
        timeoutId = _rejections$get.timeoutId;

    clearTimeout(timeoutId);
    timeoutIds.delete(timeoutId);
    rejections.delete(promise);
  }
};

var disableRejectionTracking = function disableRejectionTracking() {
  enabled = false;
  window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  window.removeEventListener('rejectionhandled', handleRejectionHandled);
  timeoutIds.forEach(function (timeoutId) {
    return clearTimeout(timeoutId);
  });
};

exports.disableRejectionTracking = disableRejectionTracking;

var enableRejectionTracking = function enableRejectionTracking() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (enabled) {
    disableRejectionTracking();
  }

  enabled = true;

  if (options.timeout) {
    timeout = options.timeout;
  }

  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  window.addEventListener('rejectionhandled', handleRejectionHandled);
};

exports.enableRejectionTracking = enableRejectionTracking;