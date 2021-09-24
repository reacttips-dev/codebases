'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import I18n from 'I18n';
var DEFAULT_COUNTRY = 'us';
var LANG_TO_ISO2 = {
  de: 'de',
  en: 'us',
  es: 'es',
  fi: 'fi',
  fr: 'fr',
  it: 'it',
  ja: 'jp',
  nl: 'nl',
  sv: 'se'
};
export default (function () {
  var _I18n$locale$split = I18n.locale.split('-'),
      _I18n$locale$split2 = _slicedToArray(_I18n$locale$split, 2),
      lang = _I18n$locale$split2[0],
      country = _I18n$locale$split2[1];

  if (country) {
    return country;
  } else if (LANG_TO_ISO2[lang]) {
    return LANG_TO_ISO2[lang];
  }

  return DEFAULT_COUNTRY;
});