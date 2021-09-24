'use es6';

import getLangLocale from './getLangLocale';
import TitleFormatters from './TitleFormatters';
var CJK_HIRAGANA_REGEX = new RegExp(/[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]|[\u3040-\u309F]|[\u3005]|[\u3031-\u3032]|[\u3131-\uD79D]/);
var KATAKANA_REGEX = new RegExp(/[\u30A0-\u30FF]/);
var KATAKANA_SEPARATOR = '・'; // Formats a first and last name depending on the character set.

export default (function (_ref, options) {
  var name = _ref.name,
      firstName = _ref.firstName,
      lastName = _ref.lastName,
      email = _ref.email,
      titleType = _ref.titleType;
  var first = firstName && firstName.trim();
  var last = lastName && lastName.trim();
  var fullName = name && name.trim();
  var formattedName;

  if (!first && !last) {
    formattedName = fullName || email || '';
  } else if (first && !last) {
    formattedName = first;
  } else if (!first && last) {
    formattedName = last;
  }

  if (typeof formattedName === 'undefined') {
    var cjkLastTest = CJK_HIRAGANA_REGEX.test(last);
    var cjkFirstTest = CJK_HIRAGANA_REGEX.test(first);
    var katakanaLastTest = KATAKANA_REGEX.test(last);
    var katakanaFirstTest = KATAKANA_REGEX.test(first);

    if (cjkLastTest && cjkFirstTest || cjkLastTest && katakanaFirstTest || katakanaLastTest && cjkFirstTest) {
      formattedName = last + " " + first;
    } else if (katakanaFirstTest && katakanaLastTest) {
      formattedName = "" + first + KATAKANA_SEPARATOR + last;
    } else {
      formattedName = first + " " + last;
    }
  }

  if (titleType) {
    var lang = options && options.locale || getLangLocale();
    var titleFormatter = TitleFormatters[lang] && TitleFormatters[lang][titleType];

    if (titleFormatter) {
      formattedName = titleFormatter(formattedName);
    }
  }

  return formattedName;
});