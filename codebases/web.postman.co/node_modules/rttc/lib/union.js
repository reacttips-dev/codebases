/**
 * Module dependencies
 */


var _ = require('@sailshq/lodash');
var buildTwoHeadedSchemaCursor = require('./helpers/build-two-headed-schema-cursor');
var TYPES = require('./helpers/types');
var infer = require('./infer');
var getDefaultExemplar = require('./get-default-exemplar');



/**
 * union()
 *
 * Given two rttc schemas, return the most specific schema that
 * would accept the superset of what both schemas accept normally.
 *
 *
 * @param  {*} schema0
 * @param  {*} schema1
 * @param  {boolean} isExemplar - if set, the schemas will be treated as exemplars (rather than type schemas)
 * @param  {boolean} isStrict - if set, the schemas will be unioned using strict validation rules.
 * @return {*}
 */

module.exports = function union (schema0, schema1, isExemplar, isStrict) {

  /*
    // Type union: (using strict validation rules)

    (plan is to not worry about supporting uncertainty at the moment)

    // Special cases:
    // inside a generic dictionary keypath: act like 'json'
    // inside a generic array keypath: act like 'json'
    // inside a JSON keypath: act like 'json'
    // inside a ref keypath: act like 'ref'
    // inside any other keypath: not possible, that's an error (will be caught during stabilization, so we can ignore)

    // Types always union with themselves, with an identity result.
    'string'  ∪  'string'          <====> 'string'
    'number'  ∪  'number'          <====> 'number'
    'boolean'  ∪  'boolean'        <====> 'boolean'
    'lamda'  ∪  'lamda'            <====> 'lamda'
    {}  ∪  {}                      <====> {}
    []  ∪  []                      <====> []
    'json'  ∪  'json'              <====> 'json'
    'ref'  ∪  'ref'                <====> 'ref'

    // Every type unions with "ref", resulting in "ref"
    (anything)   ∪  'ref'          <====> 'ref'

    // Every type but "lamda" unions with "lamda", resulting in "ref"
    'lamda'    ∪  (anything else)       <====> 'ref'

    // Every type except "ref" and "lamda" unions with "json", resulting in "json"
    (anything else) ∪  'json'           <====> 'json'

    // Primitive types union with most things to result in "json"
    'string'    ∪  'number'        <====> 'json'
    'string'    ∪  'boolean'       <====> 'json'
    'string'    ∪  'lamda'         <====> 'json'
    'string'    ∪  (any dictionary)    <====> 'json'
    'string'    ∪  (any array)    <====> 'json'

    'number'    ∪  'string'        <====> 'json'
    'number'    ∪  'boolean'       <====> 'json'
    'number'    ∪  'lamda'         <====> 'json'
    'number'    ∪  (any dictionary)    <====> 'json'
    'number'    ∪  (any array)    <====> 'json'

    'boolean'    ∪  'number'        <====> 'json'
    'boolean'    ∪  'string'       <====> 'json'
    'boolean'    ∪  'lamda'         <====> 'json'
    'boolean'    ∪  (any dictionary)    <====> 'json'
    'boolean'    ∪  (any array)    <====> 'json'

    // Faceted dictionaries union w/ generic dictionaries to result in generic dictionaries.
    {'a': 'boolean'} ∪  {}           <====> {}

    // Faceted dictionaries union w/ each other, recursively unioning their child properties.
    // If a key is missing, the result will be a generic dictionary.
    {'a': 'boolean'} ∪  {'a':'string'}           <====> {'a': 'json'}
    {'a': 'lamda'}   ∪  {'a':'string'}           <====> {'a': 'ref'}
    {'a': 'boolean'} ∪  {'b':'string'}           <====> {}


    // Patterned arrays union w/ generic arrays to result in generic arrays.
    [{'a': 'boolean'}] ∪  []           <====> []

    // Patterned arrays union w/ each other, recursively unioning their patterns.
    ['string'] ∪  ['number']            <====> ['json']
    ['lamda'] ∪  ['boolean']            <====> ['ref']
    [[]] ∪  ['number']            <====> ['json']
    [[[]]] ∪  ['number']            <====> ['json']
    [[[]]] ∪  [['number']]            <====> [['json']]
    [{a:'boolean'}] ∪  [{a:'string'}]           <====> [{'a': 'json'}]
    [{a:'boolean'}] ∪  [{b:'string'}]           <====> [{}]
    [{a:'boolean'}] ∪  [[{b:'string'}]]         <====> ['json']


    // Exceptions when NOT using strict validation:
    'number'    ∪  'string'        <====> 'string'
    'boolean'    ∪  'string'       <====> 'string'
    'number'    ∪  'boolean'       <====> 'number'

   */

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
      },

      containsType: function (){
        var searchingForTypes = Array.prototype.slice.call(arguments);
        return _.any(searchingForTypes, function (typeName){
          if (!_.isObject(schema)) {
            return false;
          }
          if (_.isArray(schema)) {
            if (schema.length > 0) {
              return false;
            }
            if (!_.isObject(schema[0])) {
              return thisSchema(schema[0]).is(typeName);
            }
            return thisSchema(schema[0]).containsType(typeName);
          }
          return _.reduce(schema, function (memo, value, key) {
            if (!_.isObject(value)) {
              return memo || thisSchema(value).is(typeName);
            }
            return memo || thisSchema(value).containsType(typeName);
          }, false);
        });
      }
    };
  }
  // exemplar-vs-type-schema-agnostic helper for building return values
  function normalizeResult(type){
    if (!isExemplar) {
      return type;
    }
    return getDefaultExemplar(type);
  }



  // Configure two-headed type schema cursor and use it to recursively
  // determine the type schema union.
  var twoHeadedCursor = buildTwoHeadedSchemaCursor(

    // If we pass in `false` as the first argument, it indicates we're traversing
    // type schemas rather than exemplars. If `true`, then it's the other way around.
    !!isExemplar,

    function onFacetDict(schema0, schema1, parentKeyOrIndex, iterateRecursive){
      if ( thisSchema(schema1).is('ref', 'lamda') ) {
        return normalizeResult('ref');
      }
      if (_.isArray(schema1) || !_.isObject(schema1)) {
        // If `schema1` is a faceted dictionary or patterned array which contains
        // sub-values of type:` ref` (===) or `lamda` (->), then we must make the
        // result a `ref` (===).
        if (thisSchema(schema1).containsType('ref', 'lamda')) {
          return normalizeResult('ref');
        }
        return normalizeResult('json');
      }

      var sharedKeys = _.intersection(_.keys(schema0), _.keys(schema1));

      // If there are any keys that don't exist in BOTH schemas, we'll just return
      // a generic type (ref or {}) as the union.  This way coercing a value to the
      // unioned schema will never result in data loss (i.e. stripped keys).
      var xorKeys = _.difference(_.union(_.keys(schema0), _.keys(schema1)), sharedKeys);
      if (xorKeys.length > 0) {
        // If either schema is a faceted dictionary or patterned array which contains
        // sub-values of type:` ref` (===) or `lamda` (->), then we must make the
        // result a `ref` (===).
        if (thisSchema(schema1).containsType('ref', 'lamda') || thisSchema(schema0).containsType('ref', 'lamda')) {
          return normalizeResult('ref');
        }
        return {};
      }
      return _.reduce(sharedKeys, function (memo, key) {
        memo[key] = iterateRecursive(key);
        return memo;
      }, {});
    },
    function onPatternArray(schema0, schema1, parentKeyOrIndex, iterateRecursive){
      if ( thisSchema(schema1).is('ref', 'lamda') ) {
        return normalizeResult('ref');
      }
      if (!_.isArray(schema1)) {
        // If `schema1` is a faceted dictionary or patterned array which contains
        // sub-values of type:` ref` (===) or `lamda` (->), then we must make the
        // result a `ref` (===).
        if (thisSchema(schema1).containsType('ref', 'lamda')) {
          return normalizeResult('ref');
        }
        return normalizeResult('json');
      }
      if (_.isEqual(schema1, [])) {
        return [];
      }
      return [ iterateRecursive(0) ];
    },
    function onGenericDict(schema0, schema1, parentKeyOrIndex){
      if ( thisSchema(schema1).is('ref', 'lamda') ) {
        return normalizeResult('ref');
      }
      // If `schema1` is a faceted dictionary or patterned array which contains
      // sub-values of type:` ref` (===) or `lamda` (->), then we must make the
      // result a `ref` (===).
      if (thisSchema(schema1).containsType('ref', 'lamda')) {
        return normalizeResult('ref');
      }
      if (!_.isArray(schema1) && _.isObject(schema1)) {
        return {};
      }
      return normalizeResult('json');
    },
    function onGenericArray(schema0, schema1, parentKeyOrIndex){
      if ( thisSchema(schema1).is('ref', 'lamda') ) {
        return normalizeResult('ref');
      }
      // If `schema1` is a faceted dictionary or patterned array which contains
      // sub-values of type:` ref` (===) or `lamda` (->), then we must make the
      // result a `ref` (===).
      if (thisSchema(schema1).containsType('ref', 'lamda')) {
        return normalizeResult('ref');
      }
      if (_.isArray(schema1)) {
        return [];
      }
      return normalizeResult('json');
    },
    function onJson(schema0, schema1, parentKeyOrIndex) {
      if ( thisSchema(schema1).is('ref', 'lamda') ) {
        return normalizeResult('ref');
      }
      // If `schema1` is a faceted dictionary or patterned array which contains
      // sub-values of type:` ref` (===) or `lamda` (->), then we must make the
      // result a `ref` (===).
      if (thisSchema(schema1).containsType('ref', 'lamda')) {
        return normalizeResult('ref');
      }
      return normalizeResult('json');
    },
    function onRef(schema0, schema1, parentKeyOrIndex) {
      return normalizeResult('ref');
    },
    function onLamda(schema0, schema1, parentKeyOrIndex) {
      if ( thisSchema(schema1).is('lamda') ) {
        return normalizeResult('lamda');
      }
      return normalizeResult('ref');
    },
    function onString(schema0, schema1, parentKeyOrIndex) {
      if ( thisSchema(schema1).is('string') ) {
        return schema1;
      }
      // If `schema1` is a faceted dictionary or patterned array which contains
      // sub-values of type:` ref` (===) or `lamda` (->), then we must make the
      // result a `ref` (===).
      if (thisSchema(schema1).containsType('ref', 'lamda')) {
        return normalizeResult('ref');
      }
      if (!isStrict){
        if ( thisSchema(schema1).is('number', 'boolean') ) {
          return schema0;
        }
      }
      if (
        thisSchema(schema1).is('number', 'boolean', 'json') ||
        _.isArray(schema1) ||
        _.isObject(schema1)
        ) {
        return normalizeResult('json');
      }

      return normalizeResult('ref');
    },
    function onNumber(schema0, schema1, parentKeyOrIndex) {
      if ( thisSchema(schema1).is('number') ) {
        return schema1;
      }
      // If `schema1` is a faceted dictionary or patterned array which contains
      // sub-values of type:` ref` (===) or `lamda` (->), then we must make the
      // result a `ref` (===).
      if (thisSchema(schema1).containsType('ref', 'lamda')) {
        return normalizeResult('ref');
      }
      if (!isStrict){
        if ( thisSchema(schema1).is('string') ) {
          return schema1;
        }
        if ( thisSchema(schema1).is('boolean') ) {
          return schema0;
        }
      }
      if (
        thisSchema(schema1).is('string', 'boolean', 'json') ||
        _.isArray(schema1) ||
        _.isObject(schema1)
        ) {
        return normalizeResult('json');
      }
      return normalizeResult('ref');
    },
    function onBoolean(schema0, schema1, parentKeyOrIndex) {
      if ( thisSchema(schema1).is('boolean') ) {
        return schema1;
      }
      // If `schema1` is a faceted dictionary or patterned array which contains
      // sub-values of type:` ref` (===) or `lamda` (->), then we must make the
      // result a `ref` (===).
      if (thisSchema(schema1).containsType('ref', 'lamda')) {
        return normalizeResult('ref');
      }

      if (!isStrict){
        if ( thisSchema(schema1).is('string', 'number') ) {
          return schema1;
        }
      }

      if (
        thisSchema(schema1).is('number', 'string', 'json') ||
        _.isArray(schema1) ||
        _.isObject(schema1)
        ) {
        return normalizeResult('json');
      }
      return normalizeResult('ref');
    }
  );

  // Run the iterator to get the schema union.
  var result = twoHeadedCursor(schema0, schema1);

  // This makes sure the resulting exemplar won't be `undefined`.
  if (isExemplar) {
    if (_.isUndefined(result)) {
      return TYPES.ref.getExemplar();
    }
  }

  return result;
};

