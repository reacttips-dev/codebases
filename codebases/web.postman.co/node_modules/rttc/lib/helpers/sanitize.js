/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var Readable = require('stream').Readable;



/**
 * Rebuild a value to make it JSON-compatible (plus some extra affordances)
 * This is used when validating/coercing an array or dictionary (and its contents)
 * against `example: {}` or `example: []`.
 *
 * It is also used elsewhere throughout rttc.
 *
 * @param {Anything} val
 * @param {Boolean?} allowNull
 * @param {Boolean?} dontStringifyFunctions
 * @param {Boolean?} allowNaNAndFriends
 * @param {Boolean?} doRunToJSONMethods
 *                   ^^^^^^^^^^^^^^^^^^
 *                   (only applies to certain things -- see https://trello.com/c/5SkpUlhI/402-make-customtojson-work-with-actions2#comment-5a3b6e7b43107b7a2938e7bd)
 */
module.exports = function rebuildSanitized(val, allowNull, dontStringifyFunctions, allowNaNAndFriends, doRunToJSONMethods) {

  // Does not `allowNull` by default.

  // Never allows `undefined` at the top level (or inside- but that check is below in stringifySafe)
  if (_.isUndefined(val)) {
    if (allowNull) { return null; }
    else { return undefined; }
  }

  return _rebuild(val, allowNull, dontStringifyFunctions, allowNaNAndFriends, doRunToJSONMethods);
};

// (note that the recursive validation will not penetrate deeper into this
//  object, so we don't have to worry about this function running more than once
//  and doing unnecessary extra deep copies at each successive level)


// If dictionary:
// ==============================================================================
// Sanitize a dictionary provided for a generic dictionary example (`example: {}`)
// The main recursive validation function will not descend into this dictionary because
// it's already met the minimum requirement of being an object.  So we need to deep clone
// the provided value for safety; and in the process ensure that it meets the basic minimum
// quality requirements (i.e. no dictionaries within have any keys w/ invalid values)

// If array:
// ==============================================================================
// Sanitize an array provided for a generic array example (`example: []`)
// The main recursive validation function will not descend into this array because
// it's already met the minimum requirement of being `_.isArray()`.  So we need to
// deep clone the provided value for safety; and in the process ensure that it meets
// the basic minimum quality requirements (i.e. no dictionaries within have any keys w/
// invalid values)
//
// We also don't include invalid items in the rebuilt array.
//
// (NOTE: `example: ['===']` won't make it here because it will be picked up
// by the recursive validation.  And so it's different-- it will contain
// the original items, and therefore may contain dictionaries w/ keys w/ invalid values)

function _rebuild(val, allowNull, dontStringifyFunctions, allowNaNAndFriends, doRunToJSONMethods) {
  var stack = [];
  var keys = [];

  // This was modified from @isaacs' json-stringify-safe
  // (see https://github.com/isaacs/json-stringify-safe/commit/02cfafd45f06d076ac4bf0dd28be6738a07a72f9#diff-c3fcfbed30e93682746088e2ce1a4a24)
  var cycleReplacer = function(unused, value) {
    if (stack[0] === value) { return '[Circular ~]'; }
    return '[Circular ~.' + keys.slice(0, stack.indexOf(value)).join('.') + ']';
  };

  function _recursivelyRebuildAndSanitize (val, key) {

    // Handle circle jerks
    if (stack.length > 0) {
      var self = this;
      var thisPos = stack.indexOf(self);
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(self);
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
      if (~stack.indexOf(val)) {
        val = cycleReplacer.call(self, key, val);
      }
    }
    else { stack.push(val); }



    // Rebuild and strip undefineds/nulls
    if (_.isArray(val)) {
      return _.reduce(val,function (memo, item, i) {
        if (!_.isUndefined(item) && (allowNull || !_.isNull(item))) {
          memo.push(_recursivelyRebuildAndSanitize.call(val, item, i));
        }
        return memo;
      }, []);
    }

    // Serialize errors, regexps, dates, and functions to strings:
    else if (_.isError(val)){
      if (doRunToJSONMethods && _.isFunction(val.toJSON)) {
        val = val.toJSON();
      } else {
        val = val.stack;
      }
    }
    else if (_.isRegExp(val)){
      val = val.toString();
    }
    else if (_.isDate(val)){
      val = val.toJSON();
    }
    else if (_.isFunction(val)){
      if (!dontStringifyFunctions) {
        val = val.toString();
      }
    }
    else if (!_.isObject(val)) {
      // Coerce NaN, Infinity, and -Infinity to 0:
      // (unless "allowNaNAndFriends" is enabled)
      if (!allowNaNAndFriends) {
        if (_.isNaN(val)) {
          val = 0;
        }
        else if (val === Infinity) {
          val = 0;
        }
        else if (val === -Infinity) {
          val = 0;
        }
      }

      // Always coerce -0 to +0 regardless.
      if (val === 0) {
        val = 0;
      }
    }
    else if (_.isObject(val)) {
      // Reject readable streams out of hand
      if (val instanceof Readable) {
        return null;
      }
      // Reject buffers out of hand
      if (val instanceof Buffer) {
        return null;
      }
      // Reject `RttcRefPlaceholders` out of hand
      // (this is a special case so there is a placeholder value that ONLY validates stricly against the "ref" type)
      // (note that like anything else, RttcRefPlaceholders nested inside of a JSON/generic dict/generic array get sanitized into JSON-compatible things)
      if (_.isObject(val.constructor) && val.constructor.name === 'RttcRefPlaceholder') {
        return null;
      }
      // Run its .toJSON() method and use the result, if appropriate.
      if (doRunToJSONMethods && _.isFunction(val.toJSON)) {
        return val.toJSON();
      }//•

      return _.reduce(_.keys(val),function (memo, key) {
        var subVal = val[key];
        if (!_.isUndefined(subVal) && (allowNull || !_.isNull(subVal))) {
          memo[key] = _recursivelyRebuildAndSanitize.call(val, subVal, key);
        }
        return memo;
      }, {});
    }


    return val;
  }

  // Pass in the empty string for the top-level "key"
  // to satisfy Mr. isaac's replacer
  return _recursivelyRebuildAndSanitize(val, '');
}
