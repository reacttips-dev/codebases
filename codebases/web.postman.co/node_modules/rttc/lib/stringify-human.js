/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var dehydrate = require('./dehydrate');
var stringify = require('./stringify');
var validateStrict = require('./validate-strict');
var coerce = require('./coerce');
var isEqual = require('./is-equal');



/**
 * Given a value and expectedTypeSchema, return a string that could be passed
 * to `.parseHuman()` along with the same expectedTypeSchema to get the same value.
 * (think of this as the inverse to `.parseHuman()`)
 *
 * This function also strictly validates value against `expectedTypeSchema`, and ensures
 * that the process is reversible w/ parseHuman (if it is not, this function throws)
 *
 * @param  {===} value
 * @param  {*} expectedTypeSchema
 * @return {String}
 */
module.exports = function stringifyHuman (value, expectedTypeSchema) {

  if (!expectedTypeSchema) {
    throw new Error('rttc.stringifyHuman() requires `expectedTypeSchema` as a second argument');
  }

  // Validate that the value matches the provided type schema.
  try {
    validateStrict(expectedTypeSchema, value);
  }
  catch (e) {
    throw new Error('rttc.stringifyHuman() failed: the provided value does not match the expected type schema.\nDetails:\n'+e.stack);
  }

  // Note that we always "allowNull" below -- that's ok because we already did a strict validation check above.

  // Double-check that the value can be stringified (i.e. that the dehydrated value is equivalent
  // to the original value)
  // This ensures there are no getters or crazy stuff like that, and that the original value can
  // actually be "reclaimed" from the string we're creating now w/ `parseHuman()`.
  // (this also ensures we clone the original value before doing anything weird)
  var dehydratedValue = dehydrate(value, true);
  if (!isEqual(dehydratedValue, value, expectedTypeSchema)) {
    throw new Error('rttc.stringifyHuman() failed: the provided value cannot be safely stringified in a reversible way.');
  }

  // For facet/pattern types, rttc.stringify the value and return it.
  // (b/c the user would need to enter valid JSON)
  if (_.isObject(expectedTypeSchema) && !_.isEqual(expectedTypeSchema, {}) && !_.isEqual(expectedTypeSchema, [])) {
    return stringify(dehydratedValue, true);
  }
  // For primitive types and lamdas, return the dehydrated value, simply coerced to a string.
  else if (expectedTypeSchema === 'lamda' || expectedTypeSchema === 'string' || expectedTypeSchema === 'number' || expectedTypeSchema === 'boolean') {
    return coerce('string', dehydratedValue);
  }
  // Otherwise, for generics, rttc.stringify the value and return it.
  else {
    // Only allow null if this is `json` or `ref`
    if (expectedTypeSchema === 'ref' || expectedTypeSchema === 'json') {
      return stringify(dehydratedValue, true);
    }
    return stringify(dehydratedValue, true);
  }
};
