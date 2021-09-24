'use es6';

import createStandardI18nProvider from './createStandardI18nProvider';
import { defaultLanguage } from '../internal/legacyI18nInit';
import { PUBLIC_CACHE } from '../internal/localeCacheKeys';
export default (function (options) {
  var I18nProvider = createStandardI18nProvider(Object.assign({}, options, {
    __localesCacheKey: PUBLIC_CACHE
  }));

  if (!options || options && !options.manuallySetLocale) {
    var browserLocale = defaultLanguage;

    if (navigator && navigator.languages && navigator.languages[0]) {
      browserLocale = navigator.languages[0];
    } else if (navigator && navigator.language) {
      browserLocale = navigator.language;
    }

    I18nProvider.setLocale({
      locale: browserLocale,
      langEnabled: true
    });
  }

  return I18nProvider;
});