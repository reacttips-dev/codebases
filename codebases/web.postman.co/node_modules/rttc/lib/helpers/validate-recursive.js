/**
 * Module dependencies
 */

var util = require('util');
var _ = require('@sailshq/lodash');
var types = require('./types');
var rebuildSanitized = require('./sanitize');
var compile = require('../compile');
var getDisplayType = require('../get-display-type');


/**
 *
 * @param  {===} expected
 * @param  {===} actual
 * @param  {Array} errors  [errors encountered along the way are pushed here]
 * @param  {Array} hops   [used in error messages]
 * @param  {Boolean} strict [if set, validation will be strict]
 * @return {===} coerced value
 */
module.exports = function _validateRecursive (expected, actual, errors, hops, strict){

  // Look up expected type from `types` object using `expected`.
  var expectedType;
  var isExpectingArray;
  var isExpectingDictionary;
  var isExpectingAnything;
  var allowAnyArray;
  var allowAnyDictionary;
  var allowAnyJSONCompatible;


  // console.log('validating',actual,'against',expected,'...');


  //
  // Set special flags about what to allow/expect for the type:
  //

  // Flag [] (allow any array)
  if (_.isArray(expected) && expected.length === 0) {
    allowAnyArray = true;
  }
  // Flag {} (allow any dictionary)
  else if (_.isPlainObject(expected) && _.keys(expected).length === 0) {
    allowAnyDictionary = true;
  }
  // Flag 'ref' (allow anything that's not undefined)
  else if (expected === 'ref') {
    isExpectingAnything = true;
  }
  // Flag 'json' (allow anything that's JSON compatible)
  else if (expected === 'json') {
    allowAnyJSONCompatible = true;
  }



  //
  // Now look up the proper type validation/coercion strategy:
  //

  // Arrays
  if (_.isArray(expected)) {
    expectedType = types.array;
    isExpectingArray = true;
  }
  // Dictionaries
  else if (_.isObject(expected)) {
    expectedType = types.dictionary;
    isExpectingDictionary = true;
  }
  // everything else (i.e. 'string', 'boolean', 'number', 'ref', 'lamda', 'json')
  else {
    expectedType = types[expected];

    // If this refers to an unknown type, default
    // to a string's base type and remember the error.
    if (_.isUndefined(expectedType)) {
      errors.push((function (){
        var err = new Error('Unknown type: '+expected);
        err.code = 'E_UNKNOWN_TYPE';
        return err;
      })());
      return types.string.getBase();
    }
  }

  // Default the coercedValue to the actual value.
  var coercedValue = actual;

  // If the actual value is undefined, fill in with the
  // appropriate base value for the type.
  if(_.isUndefined(actual)) {
    coercedValue = expectedType.getBase();
  }

  // Check `actual` value using `expectedType.is()`
  if (!expectedType.is(actual)){


    // Build an E_NOT_STRICTLY_VALID error
    var newErr = (function (){
      var msg = '';
      if (_.isUndefined(actual)) {
        msg += 'Expecting ' + compile(expected) + ' (but got `undefined`)';
      }
      else {
        msg += 'Specified value (a ' + getDisplayType(actual) + ': '+((actual===Infinity||actual===-Infinity||_.isNaN(actual))?actual:compile(actual))+') ';
        msg += 'doesn\'t match the expected '+(_.isObject(expected)?getDisplayType(expected)+' ':'')+'type'+(_.isObject(expected)?' schema ':'')+ ': ' + compile(expected) + '';
      }
      if (hops.length > 0) {
        msg = '@ `'+hops.join('.')+'`: ' + msg;
      }
      var err = new Error(msg);
      err.hops = hops;
      err.actual = actual;
      err.expected = expected;
      err.code = 'E_NOT_STRICTLY_VALID';

      // This is considered a "minor" error if it can be coerced without
      // causing any errors.
      try {
        expectedType.to(actual);
        err.minor = true;
      }
      catch (e) {}
      return err;
    })();

    // Don't bother tracking minor errors unless we're in `strict` mode.
    if (!newErr.minor || (strict && newErr.minor)) {
      errors.push(newErr);
    }


    // Invalid expected type.  Try to coerce:
    try {
      coercedValue = expectedType.to(actual);
    }
    catch (e) {

      // If that doesn't work, use the base type:
      coercedValue = expectedType.getBase();

      // But also push an `E_NOT_EVEN_CLOSE` error
      errors.push((function (){
        var msg = '';
        if (_.isUndefined(actual)) {
          msg += 'Expecting ' + compile(expected) + ' (but got `undefined`)';
        }
        else {
          msg += 'Specified value (a ' + getDisplayType(actual) + ': '+compile(actual)+ ') ';
          msg += 'doesn\'t match the expected '+(_.isObject(expected)?getDisplayType(expected)+' ':'')+'type'+(_.isObject(expected)?' schema ':'')+ ': ' + compile(expected) + '';
        }
        msg += ' Attempted to coerce the specified value to match, but it wasn\'t similar enough to the expected value.';
        if (hops.length > 0) {
          msg = '@ `'+hops.join('.')+'`: ' + msg;
        }
        var err = new Error(msg);
        err.hops = hops;
        err.actual = actual;
        err.expected = expected;
        err.code = 'E_NOT_EVEN_CLOSE';
        return err;
      })());
    }
  }

  // Build partial result
  // (taking recursive step if necessary)

  // ...expecting ANYTHING ('===')
  if (isExpectingAnything) {
    // Note that, in this case, we return a mutable reference.
    return coercedValue;
  }

  // ...expecting ANY json-compatible value (`"*"`)
  if (allowAnyJSONCompatible) {
    // (run rebuildSanitized with `allowNull` enabled)
    return rebuildSanitized(coercedValue, true);
  }

  if (isExpectingArray) {

    // ...expecting ANY array (`[]`)
    if (allowAnyArray) {
      return rebuildSanitized(coercedValue, true);
    }

    // ...expecting a specific array example
    var arrayItemTpl = expected[0];
    return _.reduce(coercedValue, function (memo, coercedVal, i){

      // Never consider `undefined` a real array item. Because things cannot be and also not be.
      if (_.isUndefined(coercedVal)) {
        return memo;
      }
      memo.push(_validateRecursive(arrayItemTpl, coercedVal, errors, hops.concat(i), strict));
      return memo;
    }, []);
  }

  if (isExpectingDictionary) {

    // ...expecting ANY dictionary (`{}`)
    if (allowAnyDictionary){
      return rebuildSanitized(coercedValue, true);
    }
    // ...expecting a specific dictionary example
    return _.reduce(expected, function (memo, expectedVal, expectedKey) {
      memo[expectedKey] = _validateRecursive(expected[expectedKey], coercedValue[expectedKey], errors, hops.concat(expectedKey), strict);
      return memo;
    }, {});
  }

  // ...expecting a primitive
  return coercedValue;
};



