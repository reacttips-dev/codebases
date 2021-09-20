/**
 * Module dependencies
 */

var util = require('util');
var _ = require('@sailshq/lodash');
var types = require('./helpers/types');
var validate = require('./validate');
var parse = require('./parse');
var hydrate = require('./hydrate');


/**
 * parseHuman()
 *
 * Convert a string that was entered by a human into a value of the appropriate type.
 * By default, parse numbers and booleans-- but otherwise leave it as a string.
 *
 * On the other hand, if the optional `expectedTypeSchema` is provided, use it to make a better guess:
 *   • If the type schema is expecting a string, number, or boolean, then loose validation (`rttc.validate()`)
 *     will be performed and the potentially-coerced result will be returned.
 *   • If the type schema is expecting a function, then if `unsafeMode` is enabled, the human string will be hydrated
 *     as a JavaScript function.  Otherwise, if `unsafeMode` is false, an error will be thrown.
 *   • Finally, if the type schema is expecting a dictionary, array, JSON, or any ref, then interpret the human string
 *     as JSON (using rttc.parse(), with respect for `unsafeMode` re hydrating nested functions).  If the string cannot
 *     be parsed as JSON, an error is thrown.  But if the rttc.parse() is successful, the result is then validated against
 *     the type schema (using RTTC loose validation).  If _that_ doesn't throw an error, then the result is returned.
 *
 * @param  {String} humanString
 * @param  {*} expectedTypeSchema  [optional]
 * @param  {Boolean} unsafeMode  - enable to use `eval` to hydrate stringified functions based on `expectedTypeSchema` (this is not safe to use on user-provided input and so is disabled by default)
 * @return {*}
 */
module.exports = function parseHuman (humanString, expectedTypeSchema, unsafeMode) {

  if (!_.isString(humanString)) {
    throw new Error('rttc.parseHuman() expects a string value, but a '+typeof humanString+' was provided: '+util.inspect(humanString, false, null));
  }

  if (unsafeMode && _.isUndefined(expectedTypeSchema)) {
    throw new Error('rttc.parseHuman() cannot enable `unsafeMode` without also providing a `expectedTypeSchema`.');
  }


  // If no type schema was specified, we will try to make a nice number or boolean
  // out of the value, but if that doesn't work, we'll leave it a string.
  if (_.isUndefined(expectedTypeSchema)) {
    try {
      return types.number.to(humanString);
    }
    catch (e){}
    try {
      return types.boolean.to(humanString);
    }
    catch (e){}
    return humanString;
  }


  // --•
  // A type schema was specified.

  // If the type schema is expecting a simple string, boolean, or number, then...
  if (expectedTypeSchema === 'string' || expectedTypeSchema === 'number' || expectedTypeSchema === 'boolean') {
    // Run the string through RTTC loose validation. and send the result back.
    // (if validation fails, an error will be thrown)
    return validate(expectedTypeSchema, humanString);
  }

  // --•
  // If the type schema is expecting a simple lamda function, attempt to use hydrate.
  // (but if `unsafeMode` is disabled, just return the string as-is)
  if (expectedTypeSchema === 'lamda') {
    if (!unsafeMode) { return humanString; }
    return hydrate(humanString, expectedTypeSchema);
  }

  // --•
  // Otherwise, we'll assume this was entered as JSON and parse it first...
  // ...and if we make it past that, then we'll validate (and potentially lightly coerce) the final result.
  return validate(expectedTypeSchema, parse(humanString, expectedTypeSchema, unsafeMode));

};
