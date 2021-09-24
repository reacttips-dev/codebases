'use es6';

import registerAllData from 'I18n/init/register/sync/registerAllData';
import 'I18n/init/data/currency';
import 'I18n/init/data/baseLocales';
import 'I18n/init/data/allTimezones';
import langs from 'i2l?mode=very-lazy&query=sporks!../../lang/en.lyaml';
import { getI18nProvider } from './getI18nProvider';
import createAllI18nProvider from 'I18n/init/providers/createAllI18nProvider';
import EmailSignatureEditorLang from 'i2l?sync&query=sporks!EmailSignatureEditor/lang/en.lyaml';
export function i18nInit() {
  var provider = getI18nProvider();
  return Promise.all([provider.register(langs), registerAllData(provider), createAllI18nProvider().register(EmailSignatureEditorLang)]);
}
export function setI18nLocale() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      portal = _ref.portal,
      user = _ref.user;

  var provider = getI18nProvider();
  provider.setLocale({
    locale: user.locale,
    langEnabled: user.lang_enabled,
    timezone: portal.timezone
  });
}