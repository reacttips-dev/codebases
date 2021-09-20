'use strict';

/**
 * Coalesce function to find the first valid value.
 * A valid value is one that is not undefined, not null and not NaN (not a number).
 * If no values are valid, then the last argument is returned.
 *
 * ```js
 * console.log(koalas(undefined, null, NaN, 'a', 'b'));
 * //=> 'a'
 *
 * console.log(koalas(undefined, null, NaN, {a: 'b'}, 'b'));
 * //=> {a: 'b'}
 *
 * console.log(koalas(undefined, null, NaN, ['a', 'b', 'c'], {a: 'b'}, 'b'));
 * //=> ['a', 'b', 'c']
 *
 * console.log(koalas(undefined, NaN, null));
 * //=> null
 * ```
 * @name koalas
 * @param {Mixed} `arguments` Pass in any amount of arguments.
 * @return {Mixed} First valid value.
 * @api public
 */

function koalas() {
  var len = arguments.length;
  var arg;
  for (var i = 0; i < len; i++) {
    arg = arguments[i];
    if (hasValue(arg)) {
      return arg;
    }
  }
  return arg;
}

/**
 * Check to see if a value actually has a valid value:
 *  - not undefined
 *  - not null
 *  - not NaN (not a number)
 *
 * @param  {*} `val` value to check
 * @return {Boolean} returns `true` if the `val` has a valid value
 */

function hasValue(val) {
  // eslint-disable-next-line no-self-compare
  return val != null && val === val;
}

/**
 * Expose koalas
 */

module.exports = koalas;
