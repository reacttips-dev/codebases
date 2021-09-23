'use es6';

import i18nData from 'i2l?sync&query=sporks!../../../../lang/en.lyaml';
import { getLangEnabledLocales } from '../../internal/legacyI18nInit';
export default (function (Provider) {
  return Provider.register(i18nData, {
    getLocales: getLangEnabledLocales
  });
});