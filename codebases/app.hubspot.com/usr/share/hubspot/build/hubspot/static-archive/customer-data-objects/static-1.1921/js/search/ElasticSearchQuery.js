'use es6';

import isString from 'transmute/isString';
import * as ElasticSearchConstants from 'customer-data-objects/search/ElasticSearchConstants';
import CjkCharacterRegExp from 'I18n/constants/regex/CJK';
import { MIN_SEARCH_LENGTH } from 'customer-data-objects/search/ElasticSearchConstants';
import KatakanaCharacterRegExp from 'I18n/constants/regex/Katakana';
var invalidESQueries = [/\s+(AND|OR)\s+(AND|OR)\s+/, /^\s*(AND|OR)\s+/, /\s+(AND|OR)\s*$/];
var quotes = /"/g;

function hasUnmatchedQuotes(str) {
  var matches = str.match(quotes);

  if (!matches) {
    return false;
  }

  return matches.length % 2 === 1;
}
/**
 * Returns `true` if `value` _might_ be a valid Elastic Search query string.
 *
 * This is not an exhaustive validation.
 *
 * @example
 * isValidQuery('testing OR wow') === true
 * isValidQuery('omg OR OR') === false
 *
 * @param  {any} value
 * @return {boolean}
 */


export function isValidQuery(value) {
  return isString(value) && value !== '' && !invalidESQueries.some(function (pattern) {
    return pattern.test(value);
  }) && !hasUnmatchedQuotes(value);
}
export var isCjkCharacterContained = function isCjkCharacterContained() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return Boolean(str) && (CjkCharacterRegExp.test(str) || KatakanaCharacterRegExp.test(str));
};
export var isOfMinSearchLength = function isOfMinSearchLength(query) {
  return !!query && (query.length >= MIN_SEARCH_LENGTH || isCjkCharacterContained(query));
};
export var getTruncatedQuery = function getTruncatedQuery() {
  var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (query) {
    var splitQuery = query.split(' ');
    var hasTooManyCharacters = query.length > ElasticSearchConstants.SEARCH_LENGTH_LIMIT;
    var hasTooManyWords = splitQuery.length > ElasticSearchConstants.SEARCH_WORD_LIMIT;

    if (hasTooManyCharacters || hasTooManyWords) {
      return splitQuery.splice(0, ElasticSearchConstants.SEARCH_WORD_LIMIT).join(' ').slice(0, ElasticSearchConstants.SEARCH_LENGTH_LIMIT);
    }
  }

  return query;
};