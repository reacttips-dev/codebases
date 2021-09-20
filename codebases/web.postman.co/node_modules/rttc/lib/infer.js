/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var types = require('./helpers/types');
var inferPrimitive = require('./helpers/infer-primitive');


/**
 * Infer the type schema of the provided RTTC exemplar (aka example).
 *
 * @param  {JSON} eg [an rttc exemplar]
 * @return {JSON} [a type schema]
 */
module.exports = function infer(eg) {

  // If the exemplar isn't a dictionary or array, we will infer
  // its type without messing around with any kind of recursion.
  if(!types.dictionary.is(eg) && !types.array.is(eg)) {
    return inferPrimitive(eg);
  }
  // If the exemplar is an array...
  else if(types.array.is(eg)) {
    // If this array is empty, that means it's a generic array exemplar.
    // (we do not parse generic array exemplars recursively.)
    if (eg.length === 0) {
      return eg;
    }
    // Otherwise this is pattern array- which we do infer recursively.
    else {
      // << Recursive step >>
      return [ infer(eg[0]) ];
    }//</pattern array>
  }
  // If the exemplar is a dictionary...
  else {
    // If this dictionary is empty, that means it's a generic
    // dictionary exemplar (we do not parse generic dictionary
    // exemplars recursively.)
    if (_.keys(eg).length === 0) {
      return eg;
    }//</generic dictionary>

    // Otherwise, this is a faceted dictionary exemplar.
    // So we infer its type schema recursively.
    else {
      var dictionaryTypeSchema = {};
      _.each(_.keys(eg), function(key) {
        // << Recursive step >>
        dictionaryTypeSchema[key] = infer(eg[key]);
      });
      return dictionaryTypeSchema;
    }//</faceted dictionary>
  }
};
