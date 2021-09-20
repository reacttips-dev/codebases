/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var typeInfo = require('./type-info');
var dehydrate = require('./dehydrate');
var buildSchemaIterator = require('./helpers/build-schema-iterator');


/**
 * Given a type schema, return an exemplar which accepts precisely the same set of values.
 *
 * @param  {*} typeSchema
 * @return {*}
 */
module.exports = function getDefaultExemplar (typeSchema) {

  // Dehydrate the type schema to avoid circular recursion
  var dehydratedTypeSchema = dehydrate(typeSchema);

  // Configure type schema iterator
  return buildSchemaIterator(
    function onFacetDict(facetDictionary, parentKeyOrIndex, callRecursive){
      return _.reduce(facetDictionary, function (memo, val, key) {
        var facet = callRecursive(val, key);
        memo[key] = facet;
        return memo;
      }, {});
    },
    function onPatternArray(patternArray, parentKeyOrIndex, iterateRecursive){
      var pattern = iterateRecursive(patternArray[0], 0);
      return [ pattern ];
    },
    function onGenericDict(schema, parentKeyOrIndex){
      return typeInfo('dictionary').getExemplar();
    },
    function onGenericArray(schema, parentKeyOrIndex){
      return typeInfo('array').getExemplar();
    },
    function onOther(schema, parentKeyOrIndex){
      return typeInfo(schema).getExemplar();
    }
  )(dehydratedTypeSchema);

};


