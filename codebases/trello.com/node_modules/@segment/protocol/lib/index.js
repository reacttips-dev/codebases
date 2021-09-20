'use strict';

/**
 * Convenience alias
 */

var define = Object.defineProperty;


/**
 *  The base protocol
 */

var initialProtocol = window.location.protocol;

/**
 * Fallback mocked protocol in case Object.defineProperty doesn't exist.
 */

var mockedProtocol;


module.exports = function(protocol) {
  if (arguments.length === 0) {
    return get();
  }
  return set(protocol);
};


/**
 * Sets the protocol to be http:
 */

module.exports.http = function() {
  set('http:');
};


/**
 * Sets the protocol to be https:
 */

module.exports.https = function() {
  set('https:');
};


/**
 * Reset to the initial protocol.
 */

module.exports.reset = function() {
  set(initialProtocol);
};


/**
 * Gets the current protocol, using the fallback and then the native protocol.
 *
 * @return {String} protocol
 */

function get() {
  return mockedProtocol || window.location.protocol;
}


/**
 * Sets the protocol
 *
 * @param {String} protocol
 */

function set(protocol) {
  try {
    define(window.location, 'protocol', {
      get: function() { return protocol; }
    });
  } catch (err) {
    mockedProtocol = protocol;
  }
}
