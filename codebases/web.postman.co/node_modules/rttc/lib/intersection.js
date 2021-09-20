/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var buildTwoHeadedSchemaCursor = require('./helpers/build-two-headed-schema-cursor');
var TYPES = require('./helpers/types');



/**
 * intersection()
 *
 * Given two rttc schemas, return the most specific schema that accepts the shared subset
 * of values accepted by both, and that _does not_ accept any values that both schemas would
 * accept individually. Formally, this subset is the intersection of A and B (A ∩ B),
 * where A is the set of values accepted by `schema0` and B is the set of values accepted by
 * `schema1`.  If there is no schema that accepts only `A ∩ B` (e.g. 'boolean' ∩ `[{foo:['json']]`)
 * then this function will return `null`.  Otherwise it will return the schema that precisely
 * accepts `A ∩ B`.
 *
 * @param  {*} schema0
 * @param  {*} schema1
 * @param  {boolean} isExemplar - if set, the schemas will be treated as exemplars (rather than type schemas)
 * @param  {boolean} isStrict - if set, the schemas will be intersected using strict validation rules.
 * @return {*}
 */
module.exports = function intersection (schema0, schema1, isExemplar, isStrict) {

  // exemplar-vs-type-schema-agnostic type check helper
  function thisSchema(schema){
    return {
      is: function (){
        var acceptableTypes = Array.prototype.slice.call(arguments);
        if (!isExemplar) {
          return _.contains(acceptableTypes, schema);
        }
        return _.any(acceptableTypes, function (typeName){
          return TYPES[typeName].isExemplar(schema);
        });
      }
    };
  }


  // Configure two-headed schema cursor and use it to recursively
  // determine the schema intersection.
  var twoHeadedCursor = buildTwoHeadedSchemaCursor(

    // If we pass in `false` as the first argument, it indicates we're traversing
    // type schemas rather than exemplars. If `true`, then it's the other way around.
    !!isExemplar,

    function onFacetDict(schema0, schema1, parentKeyOrIndex, iterateRecursive){

      if ( thisSchema(schema1).is('json', 'ref') ) {
        return schema0;
      }

      var isIncompatible;
      var intersectedFacetDict = _.reduce(schema0, function (memo, val, key) {

        // If schema1 is a faceted dictionary, check to see if it has this key.
        // It not, include the key no matter what!
        if (_.isObject(schema1) && !_.isArray(schema1) && !_.isEqual(schema1, {})) {
          if (_.isUndefined(schema1[key]) || _.isNull(schema1[key])) {
            memo[key] = val;
            return memo;
          }
        }

        var intersectedFacet = iterateRecursive(key);
        if (_.isNull(intersectedFacet)) {
          isIncompatible = true;
          return memo;
        }

        memo[key] = intersectedFacet;
        return memo;
      }, {});

      if (isIncompatible) {
        return null;
      }

      // If schema1 is a faceted dictionary, check to see if it has any keys which
      // are not in schema0.  If so, include them in the intersection.
      if (_.isObject(schema1) && !_.isArray(schema1) && !_.isEqual(schema1, {})) {
        _.each(schema1, function (val, key){
          if (_.isUndefined(schema0[key]) || _.isNull(schema0[key])) {
            intersectedFacetDict[key] = val;
          }
        });
      }

      return intersectedFacetDict;
    },
    function onPatternArray(schema0, schema1, parentKeyOrIndex, iterateRecursive){
      if ( thisSchema(schema1).is('json', 'ref') ) {
        return schema0;
      }

      if (!_.isArray(schema1)) {
        return null;
      }
      var intersectedPattern = iterateRecursive(0);
      if (_.isNull(intersectedPattern)) {
        return null;
      }
      return [ intersectedPattern ];
    },
    function onGenericDict(schema0, schema1, parentKeyOrIndex){
      if ( thisSchema(schema1).is('json', 'ref') ) {
        return schema0;
      }

      if (!_.isArray(schema1) && _.isObject(schema1)) {
        return schema1;
      }
      return null;
    },
    function onGenericArray(schema0, schema1, parentKeyOrIndex){
      if ( thisSchema(schema1).is('json', 'ref') ) {
        return schema0;
      }

      if (_.isArray(schema1)) {
        return schema1;
      }
      return null;
    },
    function onJson(schema0, schema1, parentKeyOrIndex) {

      if (_.isArray(schema1)) {
        return schema1;
      }
      if (_.isObject(schema1)) {
        return schema1;
      }

      if ( thisSchema(schema1).is('ref', 'json') ) {
        return schema0;
      }
      if ( thisSchema(schema1).is('string', 'number', 'boolean') ) {
        return schema1;
      }

      return null;
    },
    function onRef(schema0, schema1, parentKeyOrIndex) {
      return schema1;
    },
    function onLamda(schema0, schema1, parentKeyOrIndex) {
      if ( thisSchema(schema1).is('lamda') ) {
        return schema1;
      }
      if ( thisSchema(schema1).is('ref') ) {
        return schema0;
      }
      return null;
    },
    function onString(schema0, schema1, parentKeyOrIndex) {
      if ( thisSchema(schema1).is('string') ) {
        return schema1;
      }
      if ( thisSchema(schema1).is('json', 'ref') ) {
        return schema0;
      }
      if (!isStrict){
        if ( thisSchema(schema1).is('number', 'boolean') ) {
          return schema1;
        }
      }
      return null;
    },
    function onNumber(schema0, schema1, parentKeyOrIndex) {
      if ( thisSchema(schema1).is('number') ) {
        return schema1;
      }
      if ( thisSchema(schema1).is('json', 'ref') ) {
        return schema0;
      }
      if (!isStrict){
        if ( thisSchema(schema1).is('string') ) {
          return schema0;
        }
        if ( thisSchema(schema1).is('boolean') ) {
          return schema1;
        }
      }
      return null;
    },
    function onBoolean(schema0, schema1, parentKeyOrIndex) {
      if ( thisSchema(schema1).is('boolean') ) {
        return schema1;
      }
      if ( thisSchema(schema1).is('json', 'ref') ) {
        return schema0;
      }
      if (!isStrict){
        if ( thisSchema(schema1).is('string', 'number') ) {
          return schema0;
        }
      }
      return null;
    }
  );


  // If either schema is void, then the intersection will always be the same.
  // (only relevant w/ exemplars)
  if (isExemplar && _.isNull(schema0) || _.isNull(schema1)) {
    return null;
  }


  // Run the iterator to get the schema intersection.
  var result = twoHeadedCursor(schema0, schema1);

  if (_.isUndefined(result)) {
    throw new Error('Consistency violation: Result from rttc.intersection() should never be `undefined`.');
  }

  return result;

};



