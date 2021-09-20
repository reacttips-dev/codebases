/**
 * Module dependencies
 */

var rebuildRecursive = require('./helpers/rebuild-recursive');


/**
 * rebuild()
 *
 * Rebuild a potentially-recursively-deep value, running
 * the specified `handleLeafTransform` lifecycle callback
 * (aka transformer function) for every primitive (i.e. string,
 * number, boolean, null) and function.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * @param {Anything} val
 *
 * @param {Function} handleLeafTransform        [run AFTER stringification of Errors, Dates, etc.]
 *        @param {Anything} leafVal
 *        @param {String} leafType [either 'string', 'number', 'boolean', 'null', or 'lamda']
 *        @return {Anything} [transformed version of `leafVal`]
 *
 * @param {Function} handleCompositeTransform   [run BEFORE recursion and stripping of undefined items/props]
 *        @param {Dictionary|Array} compositeVal
 *        @param {String} leafType [either 'array' or 'dictionary']
 *        @return {Dictionary|Array} [transformed version of `compositeVal`-- MUST BE A DICTONARY OR ARRAY THAT IS SAFE TO RECURSIVELY DIVE INTO!!!]
 *
 * @returns {JSONCompatible}
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Example usage:
 *
 * ```
 * rttc.rebuild({
 *   foo: [
 *     3,
 *     ['hey', 'yo', 235, {}]
 *   ]
 * },
 * function transformPrimitive(val, type){ return val;},
 * function transformDictOrArray(compositeThing, type) {
 *   if (type === 'array') { return compositeThing.slice(1); }
 *   else { return compositeThing; }
 * })
 *
 * // Yields:
 * // { foo: [ [ 'yo', 235, {} ] ] }
 * ```
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 */
module.exports = function rebuild(val, handleLeafTransform, handleCompositeTransform){
  return rebuildRecursive(val, handleLeafTransform, handleCompositeTransform);
};
