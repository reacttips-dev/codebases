'use es6';

import { NBSP, SPACE } from '../constants/KeyCodes';
var NBSP_CHAR = String.fromCharCode(NBSP);
var SPACE_CHAR = String.fromCharCode(SPACE);
var spaceGroups = /\s+/g;
var spaces = /\s/g;

function nonBreakingSpaceGroup(match, offset, str) {
  // A leading or trailing space group should be all NBSPs
  if (offset === 0 || offset + match.length === str.length) {
    return match.replace(spaces, NBSP_CHAR);
  } // if the group has 1 space it can break


  if (match.length === 1) {
    return SPACE_CHAR;
  } // two spaces becomes one breaking and one non-breaking


  if (match.length === 2) {
    return SPACE_CHAR + NBSP_CHAR;
  } // greater than two spaces becomes non-breaking with breaking
  // at the beginning and the end


  var result = SPACE_CHAR;

  for (var i = 1; i < match.length - 1; i++) {
    result += NBSP_CHAR;
  }

  return result + SPACE_CHAR;
}
/**
 * Transforms a non-breaking string into a normal breaking string
 * i.e. all &#160;s become &#32;s.
 *
 * @param  {string}
 * @return {string}
 */


export function toBreakingString(str) {
  return str.replace(spaces, SPACE_CHAR);
}
export function toCharArray(str) {
  var chars = [];

  for (var i = 0; i < str.length; i++) {
    chars.push(str.charCodeAt(i));
  }

  return chars;
}
/**
 * Transforms a breaking string into a non-breaking string
 * i.e. &#160;s are injected into groups of &#32;s.
 *
 * @param  {string}
 * @return {string}
 */

export function toNonBreakingString(str) {
  return str.replace(spaceGroups, nonBreakingSpaceGroup);
}
/**
 * Returns false if a string contains any chars with a code > 128,
 * true otherwise.
 *
 * @param  {string}
 * @return {boolean}
 */

export function isUnfancy(str) {
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 128) return false;
  }

  return true;
}
/**
 * Returns true if `input` is something a user might reasonably type when entering match.
 *
 * @param {string}
 * @param {string}
 */

export function inputCouldMatch(input, match) {
  // If the next match text char is in the "unfancy" range, it might require multiple keystrokes to
  // type (e.g. "¨" + "u" = "ü"). See #3885
  var matchedSubstring = '';

  for (var i = 0; i < match.length; i++) {
    if (match[i] !== input[i]) break;
    matchedSubstring += input[i];
  }

  var mismatchedInput = input.slice(matchedSubstring.length);

  if (mismatchedInput.length > 0 && isUnfancy(match.charAt(matchedSubstring.length))) {
    return false;
  }

  return true;
}