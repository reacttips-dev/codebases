'use es6';

import { getValidLocale } from './legacyI18nInit';
export default function localeMapper(locale, locales) {
  var validLocale = getValidLocale(locale);
  var localeMatch = validLocale;
  var langGroup = localeMatch.split('-')[0];

  if (locales.indexOf(localeMatch) < 0 && locales.indexOf(langGroup) >= 0) {
    localeMatch = langGroup;
  } else if (locales.indexOf(localeMatch) < 0) {
    localeMatch = null;
  }

  return localeMatch;
}