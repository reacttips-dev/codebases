'use es6';

import I18nConstants from '../constants/I18nConstants';
export var EN_LANG = 'en';
export function getLocalizedText() {
  var locale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : EN_LANG;
  var key = arguments.length > 1 ? arguments[1] : undefined;
  return I18nConstants[locale][key] || I18nConstants[EN_LANG][key];
}