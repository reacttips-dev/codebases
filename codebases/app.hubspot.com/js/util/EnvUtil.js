'use es6';

import { EN_LANG, getLocale } from './I18nUtil';
var LOCAL_DOT = 'local.';
export function isLocal() {
  return document.domain.indexOf(LOCAL_DOT) === 0;
}
export function isUserLanguageEN() {
  return getLocale() === EN_LANG;
}