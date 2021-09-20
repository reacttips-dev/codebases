/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var infer = require('./infer');


/**
 * isInvalidExample()
 *
 * Check out the provided example and see if it fails inference via rttc.infer().
 *
 * Note:
 * Although `undefined` technically is inferred as "ref", this function
 * considers it an invalid example.
 *
 * ----------------------------------------------------------------------------
 * @param  {JSON} example
 *
 * @return {===} truthy if the provided example is invalid,
 *               false otherwise.
 */
module.exports = function isInvalidExample(example, tolerateMultiItemArrays){

  if (_.isUndefined(example)) {
    return new Error('Invalid example: `undefined` is not a valid example.');
  }
  try {
    var typeSchema = infer(example);
    if (_.isUndefined(typeSchema) || _.isNull(typeSchema)) {
      return new Error('Invalid example: could not infer type schema.');
    }
  }
  catch (e) {
    return e;
  }

  return false;
};
