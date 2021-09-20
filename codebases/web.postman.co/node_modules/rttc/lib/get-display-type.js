/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var TYPES = require('./helpers/types');

/**
 * Given a value, return an INFORMAL type string loosely
 * representing its data type.
 *
 * WARNING: THIS FUNCTION IS NOT ALL THAT IT SEEMS.
 * It does not return an RDT ("RTTC display type")-- it returns a display string
 * that might include other values as well, such as `'undefined'`, `'null',
 * `'Date'`, etc.
 *
 * > ------------------------------------------------------------------------
 * > NOTE:
 * > THIS FUNCTION IS DEPRECATED AND WILL BE REMOVED IN FAVOR OF MORE
 * > SPECIFIC UTILITY METHODS IN AN UPCOMING RELEASE OF RTTC.
 * > ------------------------------------------------------------------------
 *
 * TODO: Remove this
 *
 * @param  {===} val
 * @return {String}
 */
module.exports = function getDisplayType(val){

  // `undefined` should take precedence over special exemplar syntax
  // (i.e. '===')
  if (_.isUndefined(val)) return 'undefined';

  if (TYPES.json.isExemplar(val)) return 'json';
  if (TYPES.lamda.isExemplar(val)) return 'lamda';
  if (TYPES.ref.isExemplar(val)) return 'ref';
  if (_.isEqual(val, Infinity) || _.isEqual(val, -Infinity) || _.isNaN(val)) {
    return 'invalid number';
  }
  if (_.isString(val)) return 'string';
  if (_.isNumber(val)) return 'number';
  if (_.isBoolean(val)) return 'boolean';
  if (_.isNull(val)) return 'null';
  if (_.isArray(val)) return 'array';
  if (_.isFunction(val)) return 'function';
  if (_.isDate(val)) return 'Date';
  if (_.isError(val)) return 'Error';
  if (_.isRegExp(val)) return 'RegExp';

  // If it's an object
  if (_.isObject(val)) {
    var displayType = typeof val;
    try {
      displayType = val.constructor.name;
      if (displayType.match(/object/i) && _.isPlainObject(val)) {
        return 'dictionary';
      }
      // Use the constructor name if it's anything other than "Object"
      return displayType;
    }
    catch (e){}
  }

  // ok.. wtf is it?
  return 'unknown';

};
