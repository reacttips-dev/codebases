/**
 * Module dependencies
 */

var Readable = require('stream').Stream;
var _ = require('@sailshq/lodash');


/**
 * Basic type definitions.
 *
 * Roughly based on https://github.com/bishopZ/Typecast.js
 * ________________________________________________________________________________
 * @type {Object}
 */

var TYPES = {






  //              $$\               $$\
  //              $$ |              \__|
  //   $$$$$$$\ $$$$$$\    $$$$$$\  $$\ $$$$$$$\   $$$$$$\
  //  $$  _____|\_$$  _|  $$  __$$\ $$ |$$  __$$\ $$  __$$\
  //  \$$$$$$\    $$ |    $$ |  \__|$$ |$$ |  $$ |$$ /  $$ |
  //   \____$$\   $$ |$$\ $$ |      $$ |$$ |  $$ |$$ |  $$ |
  //  $$$$$$$  |  \$$$$  |$$ |      $$ |$$ |  $$ |\$$$$$$$ |
  //  \_______/    \____/ \__|      \__|\__|  \__| \____$$ |
  //                                              $$\   $$ |
  //                                              \$$$$$$  |
  //                                               \______/
  string: {
    id: 'string',
    description: 'a string',
    getExamples: function (){
      return ['foo', 'bar', 'baz'];
    },
    is: _.isString,
    to: function(v) {

      if(_.isString(v)) { return v; }

      // Convert date into zone-independent (UTC) ISO-8601 timestamp
      if(_.isDate(v)) {
        return v.toJSON();
      }

      if (_.isUndefined(v)){
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(v instanceof Function) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(v instanceof Object) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(v instanceof Array) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      // Reject RttcRefPlaceholders
      // (this is a special case so there is a placeholder value that ONLY validates against the "ref" type)
      if (_.isObject(v) && v.constructor.name === 'RttcRefPlaceholder') {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(v === Infinity) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(v === -Infinity) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(_.isNaN(v)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if(_.isNull(v)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      return String(v);
    },
    getBase: function (){
      return '';
    },
    getExemplar: function() {
      return 'a string';
    },
    isExemplar: function (eg){
      return TYPES.str.is(eg) && !TYPES.lamda.isExemplar(eg) && !TYPES.json.isExemplar(eg) && !TYPES.ref.isExemplar(eg);
    }
  },





  //                                    $$\
  //                                    $$ |
  //  $$$$$$$\  $$\   $$\ $$$$$$\$$$$\  $$$$$$$\   $$$$$$\   $$$$$$\
  //  $$  __$$\ $$ |  $$ |$$  _$$  _$$\ $$  __$$\ $$  __$$\ $$  __$$\
  //  $$ |  $$ |$$ |  $$ |$$ / $$ / $$ |$$ |  $$ |$$$$$$$$ |$$ |  \__|
  //  $$ |  $$ |$$ |  $$ |$$ | $$ | $$ |$$ |  $$ |$$   ____|$$ |
  //  $$ |  $$ |\$$$$$$  |$$ | $$ | $$ |$$$$$$$  |\$$$$$$$\ $$ |
  //  \__|  \__| \______/ \__| \__| \__|\_______/  \_______|\__|
  //
  //
  //
  number: {
    id: 'number',
    description: 'a real number',
    getExamples: function (){
      return [-10, 11, 4.5, -942.2];
    },
    is: function(v) {
      return _.isNumber(v) && !_.isNaN(parseFloat(v)) && v!==Infinity && v!==-Infinity;
    },
    to: function(v) {

      // Check for Infinity and NaN
      if (v === Infinity || v === -Infinity) { throw new Error('E_runtimeInputTypeCoercionError'); }
      if (_.isNaN(v)) { throw new Error('E_runtimeInputTypeCoercionError'); }

      // Check for `null` and `undefined`
      if (_.isNull(v)) { throw new Error('E_runtimeInputTypeCoercionError'); }
      if (_.isUndefined(v)) { throw new Error('E_runtimeInputTypeCoercionError'); }

      // Tolerate Date instances.
      if (_.isDate(v)) { return v.getTime(); }

      // Reject any other JavaScript objects (includes dictionaries, arrays, functions, regexps, etc.)
      if (_.isObject(v)) { throw new Error('E_runtimeInputTypeCoercionError'); }

      if(TYPES.number.is(v)) { return v; }
      if(TYPES.boolean.is(v)) { return v ? 1 : 0; }
      if(TYPES.string.is(v)) {

        // Is this a string that appears to be a number?
        var isStringThatAppearsToBeNumber = (function _getIsStringThatAppearsToBeNumber(value){
          if (!_.isString(value)) { return false; }

          // (this is an exception... apparently doing `+''` and `+' '` in javascript results in `0`)
          if (value === '' || value.match(/\s/)) { return false; }

          // General case:
          if ( _.isNaN(+value) ) { return false; }
          if ( +value=== Infinity ) { return false; }
          if ( +value=== -Infinity ) { return false; }

          return true;
        })(v);

        if (!isStringThatAppearsToBeNumber) {
          throw new Error('E_runtimeInputTypeCoercionError');
        }

        // Check for Infinity
        if (v === 'Infinity' || v === '-Infinity') {
          throw new Error('E_runtimeInputTypeCoercionError');
        }
        return +v;
      }

      var num = v * 1;
      if(!_.isNumber(num)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }
      return (num === 0 && !v.match(/^0+$/)) ? 0 : num;
    },
    getBase: function (){
      return 0;
    },
    getExemplar: function() {
      return 123;
    },
    isExemplar: function (eg){
      return TYPES.number.is(eg);
    }
  },






  //  $$\                           $$\
  //  $$ |                          $$ |
  //  $$$$$$$\   $$$$$$\   $$$$$$\  $$ | $$$$$$\   $$$$$$\  $$$$$$$\
  //  $$  __$$\ $$  __$$\ $$  __$$\ $$ |$$  __$$\  \____$$\ $$  __$$\
  //  $$ |  $$ |$$ /  $$ |$$ /  $$ |$$ |$$$$$$$$ | $$$$$$$ |$$ |  $$ |
  //  $$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |$$   ____|$$  __$$ |$$ |  $$ |
  //  $$$$$$$  |\$$$$$$  |\$$$$$$  |$$ |\$$$$$$$\ \$$$$$$$ |$$ |  $$ |
  //  \_______/  \______/  \______/ \__| \_______| \_______|\__|  \__|
  //
  //
  //
  boolean: {
    id: 'boolean',
    description: 'true or false',
    getExamples: function (){
      return [true, false];
    },
    is: _.isBoolean,
    to: function(v) {
      if(_.isBoolean(v)) { return v; }
      if (_.isNumber(v)){
        if(v === 1) { return true; }
        if(v === 0) { return false; }
      }
      if (_.isString(v)) {
        if(v === 'true') { return true; }
        if(v === 'false') { return false; }
        if(v === '1') { return true; }
        if(v === '0') { return false; }
      }

      throw new Error('E_runtimeInputTypeCoercionError');
    },
    getBase: function (){
      return false;
    },
    getExemplar: function() {
      return true;
    },
    isExemplar: function (eg){
      return TYPES.boolean.is(eg);
    }
  },







  //        $$\ $$\             $$\     $$\
  //        $$ |\__|            $$ |    \__|
  //   $$$$$$$ |$$\  $$$$$$$\ $$$$$$\   $$\  $$$$$$\  $$$$$$$\   $$$$$$\   $$$$$$\  $$\   $$\
  //  $$  __$$ |$$ |$$  _____|\_$$  _|  $$ |$$  __$$\ $$  __$$\  \____$$\ $$  __$$\ $$ |  $$ |
  //  $$ /  $$ |$$ |$$ /        $$ |    $$ |$$ /  $$ |$$ |  $$ | $$$$$$$ |$$ |  \__|$$ |  $$ |
  //  $$ |  $$ |$$ |$$ |        $$ |$$\ $$ |$$ |  $$ |$$ |  $$ |$$  __$$ |$$ |      $$ |  $$ |
  //  \$$$$$$$ |$$ |\$$$$$$$\   \$$$$  |$$ |\$$$$$$  |$$ |  $$ |\$$$$$$$ |$$ |      \$$$$$$$ |
  //   \_______|\__| \_______|   \____/ \__| \______/ \__|  \__| \_______|\__|       \____$$ |
  //                                                                                $$\   $$ |
  //                                                                                \$$$$$$  |
  //                                                                                 \______/
  dictionary: {
    id: 'dictionary',
    description: 'a dictionary ({...})',
    getExamples: function (typeSchema){
      return [{}, {foo: 'bar'}, {foo: {bar: [{baz: true}]}}];
    },
    is: function(v) {
      if (!_.isObject(v)) { return false; }
      if (TYPES.array.is(v)) { return false; }
      if (!_.isPlainObject(v)) { return false; }
      // Reject readable streams
      if (v instanceof Readable) {
        return false;
      }
      // Reject buffers
      if (v instanceof Buffer) {
        return false;
      }
      // Reject RttcRefPlaceholders
      // (this is a special case so there is a placeholder value that ONLY validates against the "ref" type)
      if (_.isObject(v.constructor) && v.constructor.name === 'RttcRefPlaceholder') {
        return false;
      }
      return true;
    },
    to: function(v) {

      // Don't tolerate non-objects, or arrays, or regexps, or dates.
      if (!_.isObject(v) || _.isArray(v) || _.isDate(v) || _.isRegExp(v) || _.isError(v) || _.isFunction(v)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      // Plain objects are ok, pass them on through
      //
      // (we used to clone them here, but it's not actually necessary, since we
      // rebuild those which have explicit nested `example`s, and if this is
      // `example: {}`, we're rebuilding the dictionary and all of its contents
      // recursively anyways as the last step in `validate-recursive`.)
      if (_.isPlainObject(v)){
        return v;
      }

      // Cannot coerce a Readable stream
      if (v instanceof Readable) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      // Cannot coerce a Buffer
      if (v instanceof Buffer) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      // Reject RttcRefPlaceholders
      // (this is a special case so there is a placeholder value that ONLY validates against the "ref" type)
      if (_.isObject(v) && v.constructor.name === 'RttcRefPlaceholder') {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      // Also tolerate "pretty close" objects-- i.e. things which might have prototypal properties
      // and/or some weird getters and setters and stuff.
      return v;

    },
    getBase: function (){
      return {};
    },
    getExemplar: function() {
      return {};
    },
    isExemplar: function (eg){
      return TYPES.dictionary.is(eg);
    }
  },





  //
  //
  //   $$$$$$\   $$$$$$\   $$$$$$\  $$$$$$\  $$\   $$\
  //   \____$$\ $$  __$$\ $$  __$$\ \____$$\ $$ |  $$ |
  //   $$$$$$$ |$$ |  \__|$$ |  \__|$$$$$$$ |$$ |  $$ |
  //  $$  __$$ |$$ |      $$ |     $$  __$$ |$$ |  $$ |
  //  \$$$$$$$ |$$ |      $$ |     \$$$$$$$ |\$$$$$$$ |
  //   \_______|\__|      \__|      \_______| \____$$ |
  //                                         $$\   $$ |
  //                                         \$$$$$$  |
  //                                          \______/
  array: {
    id: 'array',
    description: 'an array ([...])',
    getExamples: function (typeSchema){
      return [[], ['foo'], [['foo']], [{foo: 'bar'}], [2,3,4], [true]];
    },
    is: _.isArray,
    to: function(v) {
      if (!_.isArray(v)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }
      return v;
    },
    getBase: function (){
      return [];
    },
    getExemplar: function() {
      return [];
    },
    isExemplar: function (eg){
      return TYPES.array.is(eg);
    }
  },





  //
  //                             ad88
  //                            d8"
  //                            88
  //  8b,dPPYba,   ,adPPYba,  MM88MMM
  //  88P'   "Y8  a8P_____88    88
  //  88          8PP"""""""    88
  //  88          "8b,   ,aa    88
  //  88           `"Ybbd8"'    88
  //
  //
  //
  // (i.e. `example: "==="`)
  //
  // (This is a special case-- not just because it accepts anything except `undefined`, including streams, buffers,
  //  crazy prototypal objects, etc., but because it passes these values through by reference.  This means the value
  //  IS NOT cloned.  This is handy for streams, for example.)
  ref: {
    id: 'ref',
    description: 'a mutable reference (===)',
    getExamples: function (){
      return [null, 'stuff', 2352, true, {foo: {bar: [{baz: true}]}}, [], {}, [{a:1,b:2}]];
    },
    is: function(v) {
      return !_.isUndefined(v);
    },
    to: function(v) {

      if(_.isUndefined(v)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      return v;
    },
    getBase: function (){
      return null;
    },
    getExemplar: function() {
      return '===';
    },
    isExemplar: function (eg){
      return (eg === '===') || _.isUndefined(eg);
    },
    getExemplarDescription: function () {
      return '3 equal signs';
    }
  },





  //
  //     88
  //     ""
  //
  //     88  ,adPPYba,   ,adPPYba,   8b,dPPYba,
  //     88  I8[    ""  a8"     "8a  88P'   `"8a
  //     88   `"Y8ba,   8b       d8  88       88
  //     88  aa    ]8I  "8a,   ,a8"  88       88
  //     88  `"YbbdP"'   `"YbbdP"'   88       88
  //    ,88
  //  888P"
  //
  // (i.e. `example: "*"`)
  //
  // aka purely JSON-serializable
  // like `{}` or `[]`, this guarantees immutability, but also permits strings, numbers,
  // or boolean values at the top level. Notably, this also permits null, both at the top-level
  // and recursively within.
  json: {
    id: 'json',
    description: 'a JSON-compatible value (*)',
    getExamples: function (){
      return [null, 'stuff', 2352, true, {foo: {bar: [{baz: true}]}}, [], {}, [{a:1,b:2}]];
    },
    is: function(v) {
      // Reject Infinity, -Infinity, and NaN
      if (v===Infinity || v===-Infinity || _.isNaN(v)) {
        return false;
      }
      // Reject readable streams
      if (v instanceof Readable) {
        return false;
      }
      // Reject buffers
      if (v instanceof Buffer) {
        return false;
      }
      // Reject RttcRefPlaceholders
      // (this is a special case so there is a placeholder value that ONLY validates against the "ref" type)
      if (_.isObject(v) && v.constructor.name === 'RttcRefPlaceholder') {
        return false;
      }
      if (_.isString(v) || _.isNumber(v) || _.isBoolean(v) || _.isPlainObject(v) || _.isArray(v) || _.isNull(v)) {
        return true;
      }
      return false;
    },
    to: function(v) {

      if(_.isUndefined(v)) {
        throw new Error('E_runtimeInputTypeCoercionError');
      }

      if (_.isObject(v)){
        // Cannot coerce a Readable stream to be compatible
        // with the wonderful world of JSON
        if (v instanceof Readable) {
          throw new Error('E_runtimeInputTypeCoercionError');
        }

        // Cannot coerce a Buffer
        if (v instanceof Buffer) {
          throw new Error('E_runtimeInputTypeCoercionError');
        }
        // Cannot coerce a RttcRefPlaceholder
        // (this is a special case so there is a placeholder value that ONLY validates against the "ref" type)
        if (_.isObject(v) && v.constructor.name === 'RttcRefPlaceholder') {
          throw new Error('E_runtimeInputTypeCoercionError');
        }
      }

      return v;
    },
    getBase: function (){
      return null;
    },
    getExemplar: function() {
      return '*';
    },
    isExemplar: function (eg){
      return eg === '*';
    },
    getExemplarDescription: function () {
      return 'a star symbol';
    }
  },






  //
  //  88                                           88
  //  88                                           88
  //  88                                           88
  //  88  ,adPPYYba,  88,dPYba,,adPYba,    ,adPPYb,88  ,adPPYYba,
  //  88  ""     `Y8  88P'   "88"    "8a  a8"    `Y88  ""     `Y8
  //  88  ,adPPPPP88  88      88      88  8b       88  ,adPPPPP88
  //  88  88,    ,88  88      88      88  "8a,   ,d88  88,    ,88
  //  88  `"8bbdP"Y8  88      88      88   `"8bbdP"Y8  `"8bbdP"Y8
  //
  // (aka `->`)
  //
  // special type which represents a function literal which must comply with a predetermined contract
  // indicating which inputs are provided and which exits are expected.
  lamda: {
    id: 'lamda',
    description: 'a function (->)',
    getExamples: function (){
      return [function (){}, function someFn(might,have,args){ return 'and probably has some code in it'; }];
    },
    is: function(v) {
      if (_.isFunction(v)) {
        return true;
      }
      return false;
    },
    to: function(v) {
      if (_.isFunction(v)) {
        return v;
      }
      throw new Error('E_runtimeInputTypeCoercionError');
    },
    getBase: function (){
      return function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); };
    },
    getExemplar: function() {
      return '->';
    },
    isExemplar: function (eg){
      return _.isString(eg) && eg.match(/(^-+>$)|(^=+>$)|(^<=+$)|(^<-+$)/);
    },
    getExemplarDescription: function () {
      return 'an arrow symbol';
    }
  },



};






// Abbreviation aliases for backwards compat.
TYPES.str = TYPES.string;
TYPES.num = TYPES.number;
TYPES.bool = TYPES.boolean;
TYPES.arr = TYPES.array;
TYPES.dict = TYPES.dictionary;

// (Mi)spelling aliases
TYPES.lambda = TYPES.lamda;

// Case-folding aliases
TYPES.JSON = TYPES.json;

module.exports = TYPES;



