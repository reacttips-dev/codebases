/* eslint-disable camelcase */
import { Locale as UppyLocale } from '@uppy/core-1.13';
// only import supported locales
import en_us from '@uppy/locales/lib/en_US';
import ar_sa from '@uppy/locales/lib/ar_SA';
import de_de from '@uppy/locales/lib/de_DE';
import es_es from '@uppy/locales/lib/es_ES';
import fr_fr from '@uppy/locales/lib/fr_FR';
import ja_jp from '@uppy/locales/lib/ja_JP';
import ko_kr from '@uppy/locales/lib/ko_KR';
import pt_br from '@uppy/locales/lib/pt_BR';
import ru_ru from '@uppy/locales/lib/ru_RU';
import zh_cn from '@uppy/locales/lib/zh_CN';
import zh_tw from '@uppy/locales/lib/zh_TW';

import { SupportedLocales } from 'i18n!nls/asset-admin';

export const uppyLocalePacks: { [key: string]: UppyLocale } = {
  ar_sa,
  de_de,
  en_us,
  es_es,
  fr_fr,
  ja_jp,
  ko_kr,
  pt_br,
  ru_ru,
  zh_cn,
  zh_tw,
};

export const defaultUppyLocalePack = en_us;

export const getUppyLocalePack = (userLocale: SupportedLocales): UppyLocale => {
  // accounts for when locale is in format such as `en-US`
  const supportedLocaleKey = userLocale.replace('-', '_').toLowerCase();

  if (uppyLocalePacks[supportedLocaleKey]) {
    return uppyLocalePacks[supportedLocaleKey];
  }
  // seems that sometimes the locale is just set as `en` rather than `en-US`, so checks for partial match
  for (const k in uppyLocalePacks) {
    if (k.includes(supportedLocaleKey)) {
      return uppyLocalePacks[k];
    }
  }

  return defaultUppyLocalePack;
};

export const getUppyLocalePackWithOverrides = (userLocale: SupportedLocales, overrides?: UppyLocale): UppyLocale => {
  const localePack = getUppyLocalePack(userLocale) || defaultUppyLocalePack;

  return {
    ...localePack,
    strings: {
      ...localePack.strings,
      ...overrides?.strings,
    },
  };
};

export default {
  uppyLocalePacks,
  getUppyLocalePackWithOverrides,
  defaultUppyLocalePack,
};
