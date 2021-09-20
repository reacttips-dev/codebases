/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var getRdt = require('./get-rdt');

/**
 * Given an RTTC "display type" aka "typeclass" string,
 * return the appropriate human-readable label for that type.
 * Useful for error messages, user interfaces, etc.
 *
 *
 * @param  {String} type
 *         Recognizes any of the standard RTTC types:
 *           • string
 *           • number
 *           • boolean
 *           • lamda
 *           • dictionary
 *           • array
 *           • json
 *           • ref
 *
 *         (Also tolerates type schemas.)
 *
 * @optional {Dictionary} options
 *
 *           @property {Boolean} plural
 *             If enabled, the returned display type will be plural.
 *             @default false
 *
 *           @property {String} capitalization
 *             One of:
 *              • "title"    (e.g. "JSON-Compatible Value", or "String")
 *              • "start"    (e.g. "JSON-compatible value", or "String")
 *              • "fragment" (e.g. "JSON-compatible value", or "string")
 *             @default "title"
 *
 *
 * @return {String}
 */
module.exports = function getDisplayTypeLabel(type, options){

  if (typeof type === 'string') {
    // OK!   This is probably an RDT, so we'll try it.
  } else if (!!type && typeof type === 'object') {
    // This might be a type schema, so we'll parsing an RDT from it first and use that.
    type = getRdt(type);
  } else {
    throw new Error('Usage error: rttc.getDisplayTypeLabel() expects a string display type such as '+
    '`dictionary` or `ref`.  If you are trying to get the display type label for an exemplar, do '+
    '`rttc.getDisplayTypeLabel(rttc.inferDisplayType(exemplar))`. If you are trying to get a display '+
    'type label to represent voidness (i.e. a null exemplar), then you should determine that on a '+
    'case-by-case basis-- there\'s no good sane default.');
  }

  // Set up defaults
  options = options || {};
  options = _.defaults(options, {
    plural: false,
    capitalization: 'title'
  });

  if (!_.contains(['title', 'start', 'fragment'], options.capitalization)) {
    throw new Error('Usage error: Unrecognized `capitalization` option: `'+options.capitalization+'`. '+
    'Should be either "title", "start", or "fragment". (defaults to "title")');
  }


  if (type === 'string') {
    switch (options.capitalization) {
      case 'title':
      case 'start':    return !options.plural ? 'String' : 'Strings';
      case 'fragment': return !options.plural ? 'string' : 'strings';
    }
  }
  else if (type === 'number') {
    switch (options.capitalization) {
      case 'title':
      case 'start':    return !options.plural ? 'Number' : 'Numbers';
      case 'fragment': return !options.plural ? 'number' : 'numbers';
    }
  }
  else if (type === 'boolean') {
    switch (options.capitalization) {
      case 'title':
      case 'start':    return !options.plural ? 'Boolean' : 'Booleans';
      case 'fragment': return !options.plural ? 'boolean' : 'booleans';
    }
  }
  else if (type === 'lamda') {
    switch (options.capitalization) {
      case 'title':
      case 'start':     return !options.plural ? 'Function' : 'Functions';
      case 'fragment':  return !options.plural ? 'function' : 'functions';
    }
  }
  else if (type === 'dictionary') {
    switch (options.capitalization) {
      case 'title':
      case 'start':     return !options.plural ? 'Dictionary' : 'Dictionaries';
      case 'fragment':  return !options.plural ? 'dictionary' : 'dictionaries';
    }
  }
  else if (type === 'array') {
    switch (options.capitalization) {
      case 'title':
      case 'start':     return !options.plural ? 'Array' : 'Arrays';
      case 'fragment':  return !options.plural ? 'array' : 'arrays';
    }
  }
  else if (type === 'json') {
    switch (options.capitalization) {
      case 'title':     return !options.plural ? 'JSON-Compatible Value' : 'JSON-Compatible Values';
      case 'start':
      case 'fragment':  return !options.plural ? 'JSON-compatible value' : 'JSON-compatible values';
    }
  }
  else if (type === 'ref') {
    switch (options.capitalization) {
      case 'title':      return !options.plural ? 'Value' : 'Values';
      case 'start':      return !options.plural ? 'Value' : 'Values';
      case 'fragment':   return !options.plural ? 'value' : 'values';
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // Note: This was changed for flexibility.  Here's the old way, for reference:
      // ```
      // case 'title':      return !options.plural ? 'Anything' : 'Any Values';
      // case 'start':      return !options.plural ? 'Value of any type' : 'Values of any type';
      // case 'fragment':   return !options.plural ? 'value of any type' : 'values of any type';
      // ```
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    }
  }
  else {
    throw new Error('Unknown type: `'+type+'`');
  }

  // (should never make it here!)
  throw new Error('Consistency violation: Could not get display type due to an internal error in RTTC.');

};
