'use es6';

import Raven from 'Raven';

var captureSecurityError = function captureSecurityError(error) {
  return Raven.captureException('SecurityError - window.top', {
    extra: {
      documentDomain: document.domain,
      referrer: document.referrer,
      error: error
    }
  });
};
/**
 * @description adds a key-value pair to the global browser API object
 * @param {String} key
 * @param {any} value
 */


export var registerBrowserApiValue = function registerBrowserApiValue(key, value) {
  if (!key) {
    throw new Error('A key must be provided when registering a browser API value');
  }

  try {
    window.top.hubspot = window.top.hubspot || {};
    window.top.hubspot.notifications = window.top.hubspot.notifications || {};
    window.top.hubspot.notifications[key] = value;
  } catch (error) {
    if (error.name === 'SecurityError') {
      console.error(error);
      captureSecurityError(error);
    } else {
      throw error;
    }
  }
};
/**
 * @description return the value of the provided key on the
 * browser API object if any exists, otherwise return null
 * @param {String} key
 */

export var getBrowserApiValue = function getBrowserApiValue(key) {
  try {
    if (window.top.hubspot && window.top.hubspot.notifications) {
      return window.top.hubspot.notifications[key];
    }
  } catch (error) {
    if (error.name === 'SecurityError') {
      console.error(error);
      captureSecurityError(error);
    } else {
      throw error;
    }
  }

  return null;
};
/**
 * @description if a method has been registered on the browser API
 * object, call it with the provided arguments, otherwise noop.
 * @param {String} key
 * @param  {...any} args
 */

export var callBrowserApiMethod = function callBrowserApiMethod(key) {
  var maybeMethod = getBrowserApiValue(key);

  if (typeof maybeMethod === 'function') {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    maybeMethod.apply(void 0, args);
  }
};