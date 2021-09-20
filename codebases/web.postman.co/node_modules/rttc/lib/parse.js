/**
 * Module dependencies
 */

var util = require('util');
var _ = require('@sailshq/lodash');
var hydrate = require('./hydrate');


/**
 * A variation on JSON.parse that also takes care of a few additional
 * edge-cases including eval-ing stringified functions.
 *
 * TODO: if `typeSchema` is provided, also coerce the decoded value to match.
 *
 * @param  {String} value
 * @param  {*} typeSchema        - optionally provide `typeSchema` so that it can be used to improve the accuracy of the deserialized result (specifically it is necessary to eval lamda functions)
 * @param  {Boolean} unsafeMode  - enable to use `eval` to hydrate stringified functions based on `typeSchema` (this is not safe to use on user-provided input and so is disabled by default)
 * @return {*}
 */
module.exports = function parse (value, typeSchema, unsafeMode) {

  // `unsafeMode` is disabled by default
  unsafeMode = unsafeMode || false;

  if (!_.isString(value)) {
    throw new Error('rttc.decode() expects a string value, but a '+typeof value+' was provided:'+util.inspect(value, false, null));
  }
  if (unsafeMode && _.isUndefined(typeSchema)) {
    throw new Error('rttc.decode() cannot enable `unsafeMode` without also providing a `typeSchema`.');
  }

  var deserializedVal;

  // Attempt to parse provided JSON-encoded value
  try {
    deserializedVal = JSON.parse(value);
  }
  catch (e) {
    throw new Error('Could not JSON.parse() provided value: '+value);
  }

  // Deserialize any lamda functions that exist in the provided input value
  // (but only in `unsafeMode`, and if `typeSchema` is provided)
  //
  // If this is a lamda type, or something which MIGHT contain a lamda type
  // (i.e. nested array or dictionary type schema), we must recursively iterate over the
  // type schema looking for lamda types, and when we find them, parse input values as
  // stringified machine fn bodies, converting them to hydrated JavaScript functions.
  if (unsafeMode) {
    deserializedVal = hydrate(deserializedVal, typeSchema);
  }

  return deserializedVal;
};
