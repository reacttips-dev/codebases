'use es6';

import { MIN_SEARCH_LENGTH } from 'customer-data-objects/search/ElasticSearchConstants';
import CjkCharacterRegExp from 'I18n/constants/regex/CJK';
import KatakanaCharacterRegExp from 'I18n/constants/regex/Katakana';
export var isCjkCharacterContained = function isCjkCharacterContained() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return Boolean(str) && (CjkCharacterRegExp.test(str) || KatakanaCharacterRegExp.test(str));
};
export var isOfMinSearchLength = function isOfMinSearchLength(query) {
  return !!query && (query.length >= MIN_SEARCH_LENGTH || isCjkCharacterContained(query));
};