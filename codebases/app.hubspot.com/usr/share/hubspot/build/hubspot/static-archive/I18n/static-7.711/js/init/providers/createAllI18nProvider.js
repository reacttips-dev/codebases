'use es6';

import { createLoader, create } from '../internal/hs-intl';
import createPublicI18nProvider from './createPublicI18nProvider';
export default (function (options) {
  var I18nProvider = options && options.shouldSetPublicI18n ? createPublicI18nProvider(options) : create();

  I18nProvider.register = function (lang) {
    var loadOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    I18nProvider.langRegistry[lang.source] = lang;
    var provider = createLoader(lang);
    return provider.load(provider.locales, loadOptions).then(function (messages) {
      return messages;
    });
  };

  return I18nProvider;
});