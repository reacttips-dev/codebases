/**
 * Module dependencies
 */

var util = require('util');
var _ = require('@sailshq/lodash');

/**
 * Combine an array of errors into a single Error object.
 *
 * @param  {Array} errors
 * @param  {String} msgSuffix
 * @return {Error}
 */
module.exports = function consolidateErrors (errors, msgSuffix) {

  // If there are errors, coallesce them into a single Error object we can throw.
  if (errors.length === 0) {
    return;
  }

  // Remove duplicate E_NOT_EVEN_CLOSE / E_NOT_STRICTLY_VALID errors.
  var uniqueErrors = _.uniq(errors, function disregardValidationErrCode(err){
    var hash = '';
    if (!err.code) {
      hash += '?';
    }
    else if (err.code !== 'E_NOT_EVEN_CLOSE' && err.code !== 'E_NOT_STRICTLY_VALID') {
      hash += err.code;
    }
    hash += err.expected;
    if (err.hops) {
      hash += err.hops.join('.');
    }
    return hash;
  });

  var errMsg = util.format(
    '%d error%s%s:',
    uniqueErrors.length, (uniqueErrors.length!==1?'s':''), (msgSuffix?(' '+msgSuffix):''),
    (
      '\n • '+ _.pluck(uniqueErrors, 'message').join('\n • ')
    )
  );
  var err = new Error(errMsg);

  // Determine the appropriate top-level error code.
  if (_.any(uniqueErrors, { code: 'E_UNKNOWN_TYPE' })) {
    err.code = 'E_UNKNOWN_TYPE';
  }
  else {
    err.code = 'E_INVALID';
  }

  // If any of the original errors are not "minor", then this is not a "minor" error.
  err.minor = _.reduce(errors, function(memo, subError) {
    if (!memo || !subError.minor) {
      return false;
    }
    return true;
  }, true);
  // Don't include `minor` property if it's falsy.
  if (!err.minor) {
    delete err.minor;
  }

  // Expose duplicate-free list of errors as `err.errors`
  err.errors = uniqueErrors;

  return err;
};


