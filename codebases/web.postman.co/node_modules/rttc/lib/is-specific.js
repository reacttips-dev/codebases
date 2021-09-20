/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var buildSchemaIterator = require('./helpers/build-schema-iterator');



/**
 * Return whether or not this schema is "specific"-- meaning
 * its type is either "string", "number", "boolean", "lamda", a
 * faceted dictionary, or a patterned array.
 *
 * This check is not recursive by default (i.e. `foo: { bar: [], baz: {} }`
 * would be considered "specific").  Set `checkRecursively` to true to enable
 * recursive parsing.
 *
 * @param  {*} schema
 * @param  {Boolean} checkRecursively  [defaults to false]
 * @param  {Boolean} isExemplar [defaults to false]
 *         if set, the schema will be treated as an exemplars (rather than a type schema)
 *
 * @return {Boolean}
 */
module.exports = function isSpecific (schema, checkRecursively, isExemplar) {

  // Build iterator
  var iterator = (buildSchemaIterator(
    function onFacetDict(facetDictionary, parentKeyOrIndex, callRecursive){
      if (!checkRecursively) {
        return true;
      }
      return _.reduce(facetDictionary, function (isSpecific, val, key) {
        return isSpecific && callRecursive(val, key);
      }, true);
    },
    function onPatternArray(patternArray, parentKeyOrIndex, iterateRecursive){
      if (!checkRecursively) {
        return true;
      }
      return iterateRecursive(patternArray[0], 0);
    },
    function onGenericDict(schema, parentKeyOrIndex){
      return false;
    },
    function onGenericArray(schema, parentKeyOrIndex){
      return false;
    },
    function onOther(schema, parentKeyOrIndex){
      if (isExemplar) {
        return (schema !== '*' && schema !== '===');
      }
      return (schema !== 'json' && schema !== 'ref');
    }
  ));

  return iterator(schema);

};

