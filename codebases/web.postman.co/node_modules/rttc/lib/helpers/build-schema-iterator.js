/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');



/**
 * Build an iterator/reducer function for a schema that builds up and returns a new value.
 *
 * Note that this works for either type schemas OR exemplars!
 *
 * @param  {Function} onFacetDict
 *         -> @param {Object} facetDictionary
 *         -> @param {String} parentKeyOrIndex
 *         -> @param {Function} iterateRecursive(nextSchema, nextKey)
 *         -> @returns {*} value for this part of our result
 *
 * @param  {Function} onPatternArray
 *         -> @param {Array} patternArray
 *         -> @param {String} parentKeyOrIndex
 *         -> @param {Function} iterateRecursive(nextSchema, nextIndex)
 *         -> @returns {*} value for this part of our result
 *
 * @param  {Function} onGenericDict
 *         -> @param {Object} schema  -- (this is always `{}`)
 *         -> @param {String} parentKeyOrIndex
 *         -> @returns {*} value for this part of our result
 *
 * @param  {Function} onGenericArray
 *         -> @param {Array} schema  -- (this is always `[]`)
 *         -> @param {String} parentKeyOrIndex
 *         -> @returns {*} value for this part of our result
 *
 * @param  {Function} onOther
 *         -> @param {*} schema
 *         -> @param {String} parentKeyOrIndex
 *         -> @returns {*} value for this part of our result
 *
 * @return {Function}
 */
module.exports = function buildIterator(onFacetDict, onPatternArray, onGenericDict, onGenericArray, onOther) {

  /**
   * @param  {*} subSchema  [description]
   * @param  {} keyOrIndex [description]
   * @return {[type]}            [description]
   */
  function _iterator(subSchema, keyOrIndex){
    if (_.isArray(subSchema)) {
      if (_.isEqual(subSchema, [])) {
        return onGenericArray(subSchema, keyOrIndex);
      }
      return onPatternArray(subSchema, keyOrIndex, function (nextSchema, nextIndex){
        return _iterator(nextSchema, nextIndex);
      });
    }
    else if (_.isObject(subSchema)) {
      if (_.isEqual(subSchema, {})) {
        return onGenericDict(subSchema, keyOrIndex);
      }
      return onFacetDict(subSchema, keyOrIndex, function (nextSchema, nextKey) {
        return _iterator(nextSchema, nextKey);
      });
    }
    else {
      return onOther(subSchema, keyOrIndex);
    }
  }

  /**
   * @param  {*} thingToTraverse
   * @return {*}
   */
  return function (thingToTraverse){
    return _iterator(thingToTraverse);
  };
};
