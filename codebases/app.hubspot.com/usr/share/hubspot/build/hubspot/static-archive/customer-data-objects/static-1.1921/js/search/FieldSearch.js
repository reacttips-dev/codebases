'use es6';

var nonWordCharacters = '[`~!@#$%^&*()\\\\\\-_=+[{}\\]\\|;:\'",<.>/?\\s]+';
var nonWordCharactersExp = new RegExp(nonWordCharacters, 'g');
/**
 * Given a search string, makes a RegExp that fuzzily matches the search.
 *
 * e.g. given "omg this is cool", the RegExp would match "OMG! this is cool!!!"
 *
 * @param  {string} search
 * @return {RegExp}
 */

export function makeFuzzyRegExp(search) {
  return new RegExp(search.trim().toLowerCase().replace(nonWordCharactersExp, nonWordCharacters), 'i');
}