import { resolve } from 'path'

import intervalPlural from 'i18next-intervalplural-postprocessor'
import cookies from 'js-cookie'
import NextI18Next, { InitConfig } from 'next-i18next'
import getConfig from 'next/config'
import { initReactI18next } from 'react-i18next'

import { i18n, format } from 'tribe-translation'

import { logger } from 'lib/logger'

const Lang = {
  EN: 'en',
  DE: 'de',
  RU: 'ru',
  TR: 'tr',
  AZ: 'az',
}

const LangTitles = {
  en: 'English',
  de: 'Deutsch',
  ru: 'Russian',
  tr: 'Turkish',
  az: 'Azerbaijani',
}

const {
  publicRuntimeConfig: { localeSubpaths },
} = getConfig()

const LANG_COOKIE_NAME = 'language'

const getStoredLanguage = (): string | undefined =>
  cookies.get(LANG_COOKIE_NAME)

const lang = getStoredLanguage() || Lang.EN

i18n.use(initReactI18next).init({
  lng: lang,
  react: {
    useSuspense: false,
  },
})

const i18nOptions: InitConfig = {
  localeSubpaths,
  defaultNS: 'common',
  defaultLanguage: lang,
  fallbackLng: lang,
  lng: lang,
  otherLanguages: Object.values(Lang),
  shallowRender: true,
  localePath: resolve('./public/static/locales'),
  use: [intervalPlural],
  react: {
    useSuspense: false,
  },
  interpolation: {
    escapeValue: false,
    format,
  },
}
// TODO causes bug with translations
//  https://linear.app/tribe/issue/DEV-1534/when-there-is-one-comment-it-should-be-shown-in-singular-1-comment
// const localePath = 'public/static/locales'
// const localeStructure = '{{lng}}/{{ns}}'
//
// if (process.env.NODE_ENV === 'production') {
//   i18nOptions.backend = {
//     loadPath: `${getRuntimeConfigVariable(
//       'SHARED_CDN_HOST',
//     )}/${localePath}/${localeStructure}.json`,
//   }
// }
const {
  Link,
  appWithTranslation,
  withTranslation,
  useTranslation,
  Trans,
} = new NextI18Next(i18nOptions)

/**
 * Saves given language to cookies and updates UI
 * @param newLanguage - Language code. Ex: en, ru, de, tr, az
 */
const setUILanguage = (newLanguage: string) => {
  if (!newLanguage || i18n.language === newLanguage) {
    return
  }

  // If the given language is invalid
  // the default language will be used
  if (!newLanguage) newLanguage = lang

  try {
    i18n.changeLanguage(newLanguage)
    cookies.set(LANG_COOKIE_NAME, newLanguage)
  } catch (error) {
    logger.warn('setUILanguage error =>', error)
  }
}
const getUILanguage = (): string =>
  getStoredLanguage() || i18n.language || Lang.EN

export {
  appWithTranslation,
  getStoredLanguage,
  getUILanguage,
  i18n,
  Lang,
  LangTitles,
  Link,
  setUILanguage,
  Trans,
  useTranslation,
  withTranslation,
}
