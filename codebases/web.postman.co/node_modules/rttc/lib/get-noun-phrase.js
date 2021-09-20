/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var getDisplayTypeLabel = require('./get-display-type-label');
var getRdt = require('./get-rdt');


/**
 * getNounPhrase()
 *
 * Given an RTTC "display type" string (and some options)
 * return an appropriate human-readable noun-phrase.
 * Useful for error messages, user interfaces, etc.
 *
 * @required  {String} type
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
 *
 * @optional {Dictionary} options
 *
 *           @property {Boolean} plural
 *             If enabled, the returned noun phrase will be plural.
 *             @default false
 *
 *           @property {Boolean} completeSentence
 *             If enabled, a complete sentence with a capital letter
 *             & ending punctuation (a period) will be returned.
 *             Otherwise (by default), the returned noun phrase will
 *             be a fragment designed for use in an existing sentence.
 *             @default false
 *
 *           @property {String} determiner
 *             One of:
 *              • "the"   (definite article)
 *              • "a"     (indefinite article)
 *              • "any"   (existential qualifier)
 *              • ""      (no determiner)
 *              > Note that if "a" is specified, either "a" or "an" will be used,
 *              > whichever is more appropriate.
 *              > (for more background, see https://en.wikipedia.org/wiki/Article_(grammar)
 *              >  and/or https://en.wikipedia.org/wiki/English_determiners)
 *             @default "a" (or "", if plural)
 *
 *
 * @return {String} [noun phrase]
 */
module.exports = function getNounPhrase(type, options){
  if (typeof type === 'string') {
    // OK!   This is probably an RDT, so we'll try it.
  } else if (!!type && typeof type === 'object') {
    // This might be a type schema, so we'll parsing an RDT from it first and use that.
    type = getRdt(type);
  } else {
    throw new Error('Usage error: rttc.getNounPhrase() expects a string display type such as '+
    '`dictionary` or `ref`.  If you are trying to get the noun phrase for an exemplar, do '+
    '`rttc.getNounPhrase(rttc.inferDisplayType(exemplar))`. If you are trying to get a noun '+
    'phrase to represent voidness (i.e. null exemplar), then you should determine that on a '+
    'case-by-case basis-- there\'s no good sane default.');
  }

  // Set up defaults
  options = options || {};
  options = _.defaults(options, {
    plural: false,
    completeSentence: false,
    determiner: !options.plural ? 'a' : ''
  });

  // Tolerate "an" for "a"
  if (options.determiner === 'an') {
    options.determiner = 'a';
  }

  // Validate determiner
  if (!_.contains(['the', 'a', 'any', ''], options.determiner)) {
    throw new Error('Usage error: Unrecognized `determiner` option: `'+options.determiner+'`. '+
    'Should be either "the", "a", "any", or "". (defaults to "a", or "" if plural)');
  }

  // Ensure we're not trying to use "a" in a plural noun phrase.
  if (options.plural && options.determiner === 'a') {
    throw new Error('Usage error: Cannot use that determiner ("a") to generate a plural noun phrase.  '+
    'Trust me, it wouldn\'t sound right.');
  }



  // Compute the display type label that will be used below.
  var displayTypeLabel = getDisplayTypeLabel(type, {
    capitalization: 'fragment',
    plural: options.plural
  });

  // Determine the appropriate naked noun phrase.
  // (i.e. with determiner, but without ending punctuation or start-sentence capitalization)
  var nounPhrase;
  if (type === 'string') {
    switch (options.determiner) {
      case 'the': nounPhrase = 'the '+displayTypeLabel; break;
      case 'a':   nounPhrase = 'a '+displayTypeLabel; break;
      case 'any': nounPhrase = 'any '+displayTypeLabel; break;
      case '':    nounPhrase = displayTypeLabel; break;
    }
  }
  else if (type === 'number') {
    switch (options.determiner) {
      case 'the': nounPhrase = 'the '+displayTypeLabel; break;
      case 'a':   nounPhrase = 'a '+displayTypeLabel; break;
      case 'any': nounPhrase = 'any '+displayTypeLabel; break;
      case '':    nounPhrase = displayTypeLabel; break;
    }
  }
  else if (type === 'boolean') {
    switch (options.determiner) {
      case 'the': nounPhrase = 'the '+displayTypeLabel; break;
      case 'a':   nounPhrase = 'a '+displayTypeLabel; break;
      case 'any': nounPhrase = 'any '+displayTypeLabel; break;
      case '':    nounPhrase = displayTypeLabel; break;
    }
  }
  else if (type === 'lamda') {
    switch (options.determiner) {
      case 'the': nounPhrase = 'the '+displayTypeLabel; break;
      case 'a':   nounPhrase = 'a '+displayTypeLabel; break;
      case 'any': nounPhrase = 'any '+displayTypeLabel; break;
      case '':    nounPhrase = displayTypeLabel; break;
    }
  }
  else if (type === 'dictionary') {
    switch (options.determiner) {
      case 'the': nounPhrase = 'the '+displayTypeLabel; break;
      case 'a':   nounPhrase = 'a '+displayTypeLabel; break;
      case 'any': nounPhrase = 'any '+displayTypeLabel; break;
      case '':    nounPhrase = displayTypeLabel; break;
    }
  }
  else if (type === 'array') {
    switch (options.determiner) {
      case 'the': nounPhrase = 'the '+displayTypeLabel; break;
      case 'a':   nounPhrase = 'an '+displayTypeLabel; break;
      case 'any': nounPhrase = 'any '+displayTypeLabel; break;
      case '':    nounPhrase = displayTypeLabel; break;
    }
  }
  else if (type === 'json') {
    switch (options.determiner) {
      case 'the': nounPhrase = 'the '+displayTypeLabel; break;
      case 'a':   nounPhrase = 'a '+displayTypeLabel; break;
      case 'any': nounPhrase = 'any '+displayTypeLabel; break;
      case '':    nounPhrase = displayTypeLabel; break;
    }
    // for future reference, this is where we could do:
    // > "might be a string, number, boolean, dictionary, array, or even null"
  }
  else if (type === 'ref') {
    switch (options.determiner) {
      case 'the': nounPhrase = 'the '+displayTypeLabel; break;
      case 'a':   nounPhrase = 'a '+displayTypeLabel; break;
      case 'any': nounPhrase = 'any '+displayTypeLabel; break;
      case '':    nounPhrase = displayTypeLabel; break;
    }
  }
  else {
    throw new Error('Unknown type: `'+type+'`');
  }

  // Finally, deal with sentence capitalization and ending punctuation (if relevant).
  if (options.completeSentence) {
    nounPhrase = nounPhrase[0].toUpperCase() + nounPhrase.slice(1);
    nounPhrase += '.';
  }

  // And return our noun phrase.
  return nounPhrase;

};

