/**
 * Module dependencies
 */

var types = require('./types');



/**
 * Infer the type of a primitive exemplar.
 * (note that while the inferred type schema is always a string,
 *  this doesn't mean that it _represents a string type_)
 *
 * @param  {JSON} eg   [rttc exemplar (as a number, boolean, or string)]
 * @return {String}    [type schema]
 */
module.exports = function inferPrimitive(eg) {

  // Check for `type: 'ref'` (===)
  if (types.ref.isExemplar(eg)) {
    return 'ref';
  }
  // Check for `type: 'lamda'` (->)
  else if (types.lamda.isExemplar(eg)) {
    return 'lamda';
  }
  // Check for `type: 'json'` (*)
  else if (types.json.isExemplar(eg)){
    return 'json';
  }
  // Check for string
  else if (types.string.isExemplar(eg)) {
    return 'string';
  }
  // Check for number
  else if (types.number.isExemplar(eg)) {
    return 'number';
  }
  // Check for boolean
  else if (types.boolean.isExemplar(eg)) {
    return 'boolean';
  }
  // This return value of undefined means the inference failed.
  else {
    return;
  }
};
