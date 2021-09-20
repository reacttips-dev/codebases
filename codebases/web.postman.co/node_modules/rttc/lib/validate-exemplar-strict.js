/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var rebuild = require('./rebuild');


/**
 * validateExemplarStrict()
 *
 * Check the specified value (`supposedExemplar`) and ensure it is
 * a pure RTTC exemplar. If not, throw an error.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * @param  {Anything} supposedExemplar
 *         The supposed exemplar to validate.
 *
 * @param  {Boolean} prohibitEmptyArrays
 *         If enabled, if the supposed exemplar contains any empty arrays (`[]`),
 *         then an error will be thrown (nested or at the top level).  Otherwise,
 *         (and by default) `rttc.validateExemplarStrict()` tolerates the presence
 *         of `[]`, since most RTTC/machine tooling supports that notation by
 *         understanding it as `['*']`, purely for backwards compatibility.
 *         @default false
 *
 * @throws {Error} If the provided `supposedExemplar` is not a pure RTTC exemplar.
 *         @property {String} code
 *                   This error is intentionally thrown, and always has a `code`
 *                   property of `E_INVALID_EXEMPLAR`.
 *
 * @throws {Error} If the `prohibitEmptyArrays` flag was enabled, and the provided
 *                 `supposedExemplar` contains any empty arrays (nested or at the
 *                 top level).
 *         @property {String} code
 *                   This error is intentionally thrown, and always has a `code`
 *                   property of `E_DEPRECATED_SYNTAX`.
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Example usage:
 *
 * ```
 * > x
 *    => { foo: 23, bar: 8, baz: { yeah: 'cool!', what: [Circular] } }
 *
 * > rttc.validateExemplarStrict([{a:'Whee', b: 9, c: x}])
 *    => Error: Invalid exemplar: Only strictly JSON-serializable values can qualify to be RTTC exemplars.
 *         at Object.validateExemplarStrict (/Users/mikermcneil/code/rttc/lib/validate-exemplar-strict.js:47:11)
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 */
module.exports = function validateExemplarStrict (supposedExemplar, prohibitEmptyArrays) {

  // Used below.
  var err;

  // Check for obvious bad news.
  if (_.isUndefined(supposedExemplar)) {
    err = new Error('Invalid exemplar: `undefined` is not a valid RTTC exemplar.');
    err.code = 'E_INVALID_EXEMPLAR';
    throw err;
  }
  if (_.isNull(supposedExemplar)) {
    err = new Error('Invalid exemplar: `null` is not a valid RTTC exemplar.');
    err.code = 'E_INVALID_EXEMPLAR';
    throw err;
  }
  if (prohibitEmptyArrays && _.isEqual(supposedExemplar, [])) {
    err = new Error('Invalid exemplar: Empty arrays (`[]`) are not allowed in this RTTC exemplar at any depth. (This error was thrown because `rttc.validateExemplarStrict()` with the `prohibitEmptyArrays` flag enabled.  Otherwise, any occurences of `[]` would have been understood as `[\'*\']`.)');
    err.code = 'E_DEPRECATED_SYNTAX';
    throw err;
  }

  // Check for nested nulls, and ensure serializability while we're at it.
  var rebuiltExemplar = rebuild(

    supposedExemplar,

    function transformPrimitive (val){
      if (_.isNull(val)) {
        err = new Error('Invalid exemplar: Nested `null`s are not allowed in an RTTC exemplar.');
        err.code = 'E_INVALID_EXEMPLAR';
        throw err;
      }
      return val;
    },

    function transformDictOrArray(val, type) {
      if (type === 'array' && val.length === 0 && prohibitEmptyArrays) {
        err = new Error('Invalid exemplar: Empty arrays (`[]`) are not allowed in this RTTC exemplar at any depth. (This error was thrown because `rttc.validateExemplarStrict()` with the `prohibitEmptyArrays` flag enabled.  Otherwise, any occurences of `[]` would have been understood as `[\'*\']`.)');
        err.code = 'E_DEPRECATED_SYNTAX';
        throw err;
      }
      else if (type === 'array' && val.length > 1) {
        err = new Error('Invalid exemplar: Multi-item arrays (at any depth) are not allowed in an RTTC exemplar.');
        err.code = 'E_INVALID_EXEMPLAR';
        throw err;
      }
      else { return val; }
    }

  );

  // Rebuilding the exemplar should have caused it not to change.
  // (if it did, it means it was circular, or that it contained things that
  //  could not be losslessly serialized to JSON and back again)
  if (!_.isEqual(supposedExemplar, rebuiltExemplar)) {
    err = new Error('Invalid exemplar: Only strictly JSON-serializable values can qualify to be RTTC exemplars.');
    err.code = 'E_INVALID_EXEMPLAR';
    throw err;
  }

};
