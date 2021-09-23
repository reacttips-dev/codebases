'use es6';

import createStandardI18nProvider from 'I18n/init/providers/createStandardI18nProvider';
import enLang from 'i2l?query=sporks!../../lang/en.lyaml';
import registerAllData from 'I18n/init/register/sync/registerAllData';
import 'I18n/init/data/currency';
import 'I18n/init/data/baseLocales';
import 'I18n/init/data/publicLocales';
import 'I18n/init/data/allTimezones';
var _provider = null;

function getProvider() {
  if (!_provider) {
    _provider = createStandardI18nProvider();
  }

  return _provider;
}

export function i18nInit() {
  var provider = getProvider();
  return Promise.all([provider.register(enLang), registerAllData(provider)]);
}
export function setI18nLocale() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      portal = _ref.portal,
      user = _ref.user;

  var provider = getProvider();
  provider.setLocale({
    locale: user.locale,
    langEnabled: user.lang_enabled,
    timezone: portal.timezone
  });
}