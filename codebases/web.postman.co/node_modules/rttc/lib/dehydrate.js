/**
 * Module dependencies
 */

var rebuildSanitized = require('./helpers/sanitize');


/**
 * Dehydrate/sanitize a value recursively:
 *   • stringifying functions, dates, regexps, and errors, as well
 *   • taking care of circular references
 *   • normalizing -Infinity, Infinity, and NaN (to 0)
 *   • stripping undefined (and potentially null) keys and values. If `allowNull` is set, `null` values will not be stripped from the encoded string.
 *
 * @param  {===} value
 * @param  {Boolean} allowNull  [defaults to false]
 * @param  {Boolean} dontStringifyFunctions  [defaults to false]
 * @param  {Boolean} allowNaNAndFriends  [defaults to false]
 * @param  {Boolean} doRunToJSONMethods  [defaults to false]
 *                   ^^^^^^^^^^^^^^^^^^
 *                   (only applies to certain things -- see https://trello.com/c/5SkpUlhI/402-make-customtojson-work-with-actions2#comment-5a3b6e7b43107b7a2938e7bd)
 * @return {String}
 */
module.exports = function dehydrate (value, allowNull, dontStringifyFunctions, allowNaNAndFriends, doRunToJSONMethods) {
  return rebuildSanitized(value, allowNull, dontStringifyFunctions, allowNaNAndFriends, doRunToJSONMethods);
};
