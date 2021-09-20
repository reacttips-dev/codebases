/**
 * Module dependencies
 */

var coerce = require('./coerce');
var infer = require('./infer');


/**
 * A convenience method to return the base value for the given exemplar.
 *
 * @param  {===} exemplar
 * @return {*?}
 */
module.exports = function getBaseVal(exemplar){
  return coerce(infer(exemplar));
};
