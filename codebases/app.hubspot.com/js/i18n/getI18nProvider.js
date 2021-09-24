'use es6';

import createStandardI18nProvider from 'I18n/init/providers/createStandardI18nProvider';
var _provider = null;
export function getI18nProvider() {
  if (!_provider) {
    _provider = createStandardI18nProvider();
  }

  return _provider;
}