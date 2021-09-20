/**
 * Module dependencies
 */

var types = require('./helpers/types');
var inferPrimitive = require('./helpers/infer-primitive');



/**
 * Given an RTTC exemplar, compute the display type string (aka "typeclass").
 *
 * For example, given `{foo: 'bar'}`, this returns `'dictionary'`,
 * and given `'->'`, this returns `'ref'`.  And so forth.
 *
 *
 * @param {JSON} exemplar
 *        e.g. `{soup: 'Rabbit soup'}`
 *
 * @returns  {String} [display type]
 *         Returns one of the standard RTTC display types:
 *           • string
 *           • number
 *           • boolean
 *           • lamda
 *           • dictionary
 *           • array
 *           • json
 *           • ref
 *          ...or '' (empty string is the catchall if exemplar is unrecognized; e.g. `null`)
 */
module.exports = function inferDisplayType(exemplar){
  // Currently `types.ref.is(undefined)` returns true.  This will change in
  // future of RTTC, but to preserve compatibility, we are leaving it the way
  // it is for the time being.  So we check that the exemplar is not `undefined`
  // out here. (We should pull this into the `isExemplar` function of the `ref` type
  // in a future major version release).
  if (typeof exemplar === 'undefined') {
    return '';
  }

  // If the exemplar isn't a dictionary or array, we will infer
  // its type without messing around with any kind of recursion.
  if(!types.dictionary.is(exemplar) && !types.array.is(exemplar)) {
    var displayType = inferPrimitive(exemplar);
    // If inferPrimitive returned something other than undefined, everything is in order.
    if (typeof displayType !== 'undefined') {
      return displayType;
    }
    // But otherwise, this exemplar must be null or undefined-- or perhaps something
    // completely strange, so we return empty string to indicate voidness and/or
    // our confusion.
    else {
      return '';
    }
  }
  // Otherwise, if the exemplar is an array, we return 'array'.
  else if(types.array.is(exemplar)) {
    return 'array';
  }
  // Otherwise, if the exemplar is a dictionary, we return 'dictionary'.
  else if(types.dictionary.is(exemplar)){
    return 'dictionary';
  }
  else {
    throw new Error('Consistency violation: Unexpected logic error in RTTC.');
  }
};

