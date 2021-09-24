import each from 'unified-navigation-ui/utils/each';
var translationMap = {};
export function setTranslations(translations) {
  translationMap = translations;
}
export function getTranslations() {
  return translationMap;
}

function _replacePlaceholders(str, opts) {
  if (opts.defaultValue !== undefined) {
    delete opts.defaultValue;
  }

  each(Object.keys(opts), function (key) {
    if (str.indexOf(key) > -1) {
      str = str.replace("{{ " + key + " }}", opts[key]);
    }
  });
  return str;
}

export function text(key) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (translationMap[key] !== undefined) {
    return _replacePlaceholders(translationMap[key], opts);
  } else if (opts.defaultValue !== undefined) {
    return _replacePlaceholders(opts.defaultValue, opts);
  }

  return '';
}
export function lookup(key) {
  return translationMap[key] !== undefined;
}
export var CJK_HIRAGANA_REGEX = new RegExp(/[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]|[\u3040-\u309F]|[\u3005]|[\u3031-\u3032]|[\u3131-\uD79D]/);
export var KATAKANA_REGEX = new RegExp(/[\u30A0-\u30FF]/);
var KATAKANA_SEPARATOR = '・'; // Formats a first and last name depending on the character set.

export function formatName(_ref) {
  var name = _ref.name,
      firstName = _ref.firstName,
      lastName = _ref.lastName,
      email = _ref.email;
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
    var cjkLastTest = last && CJK_HIRAGANA_REGEX.test(last);
    var cjkFirstTest = first && CJK_HIRAGANA_REGEX.test(first);
    var katakanaLastTest = last && KATAKANA_REGEX.test(last);
    var katakanaFirstTest = first && KATAKANA_REGEX.test(first);

    if (cjkLastTest && cjkFirstTest || cjkLastTest && katakanaFirstTest || katakanaLastTest && cjkFirstTest) {
      formattedName = last + " " + first;
    } else if (katakanaFirstTest && katakanaLastTest) {
      formattedName = "" + first + KATAKANA_SEPARATOR + last;
    } else {
      formattedName = first + " " + last;
    }
  }

  return formattedName;
}