'use es6';

import I18nConstants from '../constants/I18nConstants';
export var EN_LANG = 'en';
export function getLocale() {
  return (window.I18n || {}).lang || EN_LANG;
}
export function text(key) {
  return (I18nConstants[getLocale()] || I18nConstants[EN_LANG])[key];
}