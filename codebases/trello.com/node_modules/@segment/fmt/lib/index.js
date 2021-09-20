'use strict';

// Stringifier
var toString = global.JSON && typeof JSON.stringify === 'function' ? JSON.stringify : String;

/**
 * Format the given `str`.
 *
 * @param {string} str
 * @param {...*} [args]
 * @return {string}
 */
function fmt(str) {
  var args = Array.prototype.slice.call(arguments, 1);
  var j = 0;

  return str.replace(/%([a-z])/gi, function(match, f) {
    return fmt[f] ? fmt[f](args[j++]) : match + f;
  });
}

// Formatters
fmt.o = toString;
fmt.s = String;
fmt.d = parseInt;

/*
 * Exports.
 */

module.exports = fmt;
