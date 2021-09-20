/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');


/**
 * Eval stringified functions at the top-level or within value (use `typeSchema` to know
 * where to expect functions-- the "lamda" type)
 *
 * @param  {*} value
 * @param  {*} typeSchema
 * @return {*}
 */
module.exports = function hydrate (value, typeSchema) {

  if (_.isUndefined(typeSchema)) {
    throw new Error('rttc.hydrate() requires a 2nd argument (`typeSchema`).');
  }

  // Deserialize any lamda functions that exist in the provided input value,
  // including at the top level.
  //
  // If this is a lamda type, or something which MIGHT contain a lamda type
  // (i.e. nested array or dictionary type schema), we must recursively iterate over the
  // type schema looking for lamda types, and when we find them, parse input values as
  // stringified functions, converting them to hydrated JavaScript functions.
  //
  // But otherwise, we just go ahead and bail.
  if (typeSchema !== 'lamda' &&
    (!_.isObject(typeSchema) || _.isEqual(typeSchema, []) || _.isEqual(typeSchema, {}))) {
    return value;
  }

  return (function parseLamdaInputValues(val, keysSoFar){

    var typeHere = keysSoFar.length > 0 ? _.get(typeSchema, keysSoFar.join('.')) : typeSchema;

    // If this is supposed to be an array or dictionary, recursively traverse the
    // next leg of the type schema
    //
    // (note that we don't need to worry about circular refs because we've already
    // ensured JSON serializability above)
    if (_.isArray(typeHere)) {

      // if the actual value does not have an array here as expected,
      // just stop looking for lamdas this direction (there obviously aren't any,
      // and it's not the job of this function to catch any validation issues)
      if (!_.isArray(val)) {
        return val;
      }

      // Special case for array generic (`[]`)
      if (typeHere.length === 0) {
        return val;
      }

      // Since a type schema array will only have one item, we must iterate over
      // the actual value:
      return _.reduce(val, function (memo, unused, index){
        memo.push(parseLamdaInputValues(val[index], keysSoFar.concat('0') ));
        return memo;
      }, []);
    }
    else if (_.isObject(typeHere)){

      // if the actual value does not have a dictionary here as expected,
      // just stop looking for lamdas this direction (there obviously aren't any,
      // and it's not the job of this function to catch any validation issues)
      if (!_.isObject(val)) {
        return val;
      }

      // Special case for dictionary generic (`{}`)
      if (_.keys(typeHere).length === 0) {
        return val;
      }

      return _.reduce(typeHere, function (memo, unused, subKey){
        // If the key from the type schema contains `.`, then fail with an error.
        if ((''+subKey).match(/\./)) {
          throw new Error('Keys containing dots (`.`) are not currently supported in the type schema for `rttc.hydrate`.');
        }
        memo[subKey] = parseLamdaInputValues(val[subKey], keysSoFar.concat(subKey));
        return memo;
      }, {});
    }

    // If this is supposed to be a lamda, and the actual value is a string,
    // parse a function out of it.  If anything goes wrong, just pass the value
    // through as-is.
    else if (typeHere === 'lamda' && _.isString(val)) {
      try {
        var fn;
        // If the lamda string begins with "function", then we'll assume it's a
        // complete, stringified function.
        if (val.match(/^\s*function/)){
          eval('fn='+val);
        }
        // If the lamda string doesn't begin with "function", then we'll assume it
        // is a function body, and build a machine `fn` out of it (assumes standard
        // `fn` function signature)
        else {
          eval('fn=function(inputs, exits, env){'+val+'}');
        }
        return fn;
      }
      catch (e){
        // Could not parse usable lamda function from provided string-
        // so just pass the value through as-is.
        return val;
      }
    }

    // Otherwise, just return what we've got
    return val;
  })(value, []);

};
