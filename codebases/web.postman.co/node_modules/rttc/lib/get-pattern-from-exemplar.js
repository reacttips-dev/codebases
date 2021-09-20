/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');


/**
 * getPatternFromExemplar()
 *
 * Determine the pattern from the specified array exemplar.
 *
 * @param {Array} arrayExemplar
 *        The array exemplar whose pattern should be deduced.
 *        (must be a valid RTTC exemplar!)
 *
 * @returns {JSON}
 *          An RTTC exemplar.
 *
 * @throws {Error} If `arrayExemplar` is not actually an array.
 * @throws {Error} If `arrayExemplar` is not actually an exemplar because it has >1 items.
 */
module.exports = function getPatternFromExemplar(arrayExemplar){

  if (!_.isArray(arrayExemplar)) {
    throw new Error('Provided "array exemplar" is not actually an array (it is a `'+typeof arrayExemplar+'`).');
  }

  // Generic arrays (`[]`) are the same thing as generic JSON arrays (`['*']`),
  // so as you might expect, they have a `*` pattern.
  if (arrayExemplar.length === 0) {
    return '*';
  }
  // If there is only one single item, just use that.
  else if (arrayExemplar.length === 1){
    return arrayExemplar[0];
  }
  // Otherwise, this isn't actually an exemplar because it has >1 items.
  else {
    throw new Error('Provided "array exemplar" is not actually an exemplar because it has too many items ('+arrayExemplar.length+').');
  }

};
