/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var buildSchemaIterator = require('./helpers/build-schema-iterator');


/**
 * reify()
 *
 * Given an rttc type schema, strip out generics to convert it into
 * a more specific type which contains no "ref", "json", {}, or [] types.
 * In other words, this makes a type schema "strict", and the result of
 * this function always passes `rttc.isSpecific()`.
 *
 * @param  {*} typeSchema
 * @return {*}
 */
module.exports = function reify (typeSchema) {

  // Configure type schema iterator and use it to recursively
  // collapse generic types.
  var schemaIterator = buildSchemaIterator(
    function onFacetDict(facetDictionary, parentKeyOrIndex, callRecursive){
      var newFacetDict = _.reduce(facetDictionary, function (memo, val, key) {
        var facet = callRecursive(val, key);
        // Don't include collapsed sub-examples.
        if (!_.isUndefined(facet)) {
          memo[key] = facet;
        }
        return memo;
      }, {});

      // Just in case all of the properties were collapsed, don't inadvertently
      // create another generic by returning an empty {}.
      if (_.isEqual({}, newFacetDict)) {
        return undefined;
      }

      return newFacetDict;
    },
    function onPatternArray(patternArray, parentKeyOrIndex, iterateRecursive){
      var pattern = iterateRecursive(patternArray[0], 0);

      // Don't include collapsed sub-examples.
      if (_.isUndefined(pattern)) {
        return undefined;
      }
      return [ pattern ];
    },
    function onGenericDict(schema, parentKeyOrIndex){
      return undefined;
    },
    function onGenericArray(schema, parentKeyOrIndex){
      return undefined;
    },
    function onOther(schema, parentKeyOrIndex){
      if (schema === 'json') {
        return undefined;
      }
      if (schema === 'ref') {
        return undefined;
      }
      return schema;
    }
  );

  // Run the iterator to get the reified type schema.
  return schemaIterator(typeSchema);

};


