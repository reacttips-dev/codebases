/**
 * Module dependencies
 */

var validateRecursive = require('./helpers/validate-recursive');
var consolidateErrors = require('./helpers/consolidate-errors');


/**
 * Validate a bit of mystery meat (`actual`) against an `expected` type schema,
 * saving up any fatal errors and throwing them in a lump, and otherwise
 * returning the value that was accepted (i.e. because some coercion might have
 * occurred)
 *
 * @param  {~Schema} expected   type schema
 * @param  {===} actual           "mystery meat"
 * @return {<expected>}
 */
module.exports = function validate (expected, actual) {

  var errors = [];
  var result = validateRecursive(expected, actual, errors, [], false);
  // ( `false` => `strict` -- i.e. ignore minor type errors)

  // If there are still errors, coallesce the remaining list of errors into a single
  // Error object we can throw.
  var err = consolidateErrors(errors, 'validating value');
  if (err) {
    throw err;
  } else {
    return result;
  }
};


