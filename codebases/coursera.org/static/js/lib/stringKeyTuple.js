/**
 * See org.coursera.model.TupleFormats in infra-services.
 */

import _ from 'lodash';

function escapeSeparator(string) {
  if (typeof string === 'string') {
    return string.replace(/~/g, '!~');
  } else {
    return string;
  }
}

function unescapeSeparator(string) {
  return string.replace(/!~/g, '~');
}

export const naiveReverseString = (string) => {
  // DO NOT USE THIS FOR GENERAL STRING REVERSAL.  It will not do the right
  // thing, as it does not handle surrogate pairs correctly.
  //
  // We do this string-reversing business so we can use negative lookahead in
  // the regular expression used in `stringKeyToTuple`, because JavaScript
  // regular expressions do not support negative lookbehind (to ignore
  // escaped separators).
  //
  // This is only safe for our usage because:
  //
  // 1.  We reverse strings back to their original order, restoring the
  //     ordering of surrogate pairs.
  // 2.  Valid BMP UTF-16 code units do not overlap with high or low
  //     surrogates, so neither half of a surrogate pair can be
  //     misinterpreted as our escape or separator characters.

  return string.split('').reverse().join('');
};

export const stringKeyToTuple = (stringKey) => {
  // Reverse the stringKey, so we can use negative lookahead to ignore
  // escaped separators when splitting.  JavaScript does not support
  // negative lookbehind.
  const reversedStringKey = naiveReverseString(stringKey);

  // The regular expression matches '~'s that are not followed by '!'s.
  const reversedTuple = reversedStringKey.split(/~(?![!])/);

  // Reverse the tuple and the elements of the tuple to restore proper
  // ordering.
  const tuple = _.map(reversedTuple.reverse(), naiveReverseString);

  return _.map(tuple, unescapeSeparator);
};

export const tupleToStringKey = (tuple) => {
  return _.map(tuple, escapeSeparator).join('~');
};

export default {
  stringKeyToTuple,
  tupleToStringKey,
  naiveReverseString,
};
