/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var validateRecursive = require('./helpers/validate-recursive');
var consolidateErrors = require('./helpers/consolidate-errors');

/**
 * Coerce value to type schema
 * (very forgiving)
 *
 * @param  {~Schema} expected   type schema
 * @param  {===} actual           "mystery meat"
 * @return {<expected>}
 */
module.exports = function coerce (expected, actual){

  // Jump into recursive validation
  var errors = [];
  var result = validateRecursive(expected, actual, errors, []);

  // Strip out "E_NOT_STRICTLY_VALID" errors- they are ok if we're just coercing.
  _.remove(errors, {code: 'E_NOT_STRICTLY_VALID'});

  // Strip out "E_NOT_EVEN_CLOSE" errors- they are ok if we're just coercing.
  _.remove(errors, {code: 'E_NOT_EVEN_CLOSE'});

  // Note that it would be more efficient to pass in a list of error codes
  // to ignore when calling `validateRecursive`, rather than iterating through
  // the list of errors afterwards and stripping them out.

  // If there are still errors, coallesce the remaining list of errors into a single
  // Error object we can throw.
  var err = consolidateErrors(errors, 'coercing value');
  if (err) {
    throw err;
  }
  else {
    return result;
  }
};
