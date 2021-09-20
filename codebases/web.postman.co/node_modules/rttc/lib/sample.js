/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var typeInfo = require('./type-info');
var coerce = require('./coerce');
var dehydrate = require('./dehydrate');
var isEqual = require('./is-equal');
var buildSchemaIterator = require('./helpers/build-schema-iterator');


/**
 * Given a type schema, return an array of up to `n` sample values for it, in random order.
 *
 * @param  {String} typeSchema
 * @param  {Number} n  (defaults to 2)
 * @return {[===]}
 */
module.exports = function sample (typeSchema, n) {

  // Default `n` to 2
  n = _.isUndefined(n) ? 2 : n;

  // Validate `n`
  if (n < 1 || !_.isNumber(n)) {
    throw new Error('rttc.sample() expects `n` (2nd argument) to be a number >= 1 indicating the number of sample values to generate.');
  }

  // Dehydrate the type schema to avoid circular recursion
  var dehydratedTypeSchema = dehydrate(typeSchema);

  // Configure type schema iterator
  var generateSampleVal = buildSchemaIterator(
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
      return {};
    },
    function onGenericArray(schema, parentKeyOrIndex){
      return [];
    },
    function onOther(schema, parentKeyOrIndex){
      // Pick a random example
      var example = _.sample(typeInfo(schema).getExamples());
      return example;
    }
  );

  // Generate some (unique) sample values
  var samples = _.reduce(_.range(n), function (samplesSoFar, i) {
    var newSample = generateSampleVal(dehydratedTypeSchema);
    var isUnique = _.reduce(samplesSoFar, function checkUniqueness(isUnique, existingSample){
      return isUnique && !isEqual(existingSample, newSample, typeSchema);
    }, true);
    if (isUnique) {
      samplesSoFar.push(newSample);
    }
    return samplesSoFar;
  }, []);

  // Scramble them and return.
  return _.shuffle(samples);
};


