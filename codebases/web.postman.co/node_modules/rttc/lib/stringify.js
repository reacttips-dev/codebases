/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var rebuildSanitized = require('./helpers/sanitize');


/**
 * A variation on JSON.stringify that also takes care of a few additional
 * edge-cases like:
 *   • stringifying functions, dates, regexps, and errors, as well
 *   • taking care of circular references
 *   • normalizing -Infinity, Infinity, and NaN (to 0)
 *   • stripping undefined (and potentially null) keys and values. If `allowNull` is set, `null` values will not be stripped from the encoded string.
 *
 * @param  {===} value
 * @param  {Boolean} allowNull
 * @return {String}
 */
module.exports = function stringify (value, allowNull) {
  // TODO: optimize
  return JSON.stringify(rebuildSanitized(value,allowNull));
};
