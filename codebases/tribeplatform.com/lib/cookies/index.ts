import { logger } from '@tribefrontend/logger'

import {
  CookieKind,
  CookieSettings,
  Cookie,
  OptionalCookieKind,
} from 'lib/cookies/@types'

const isClient = typeof window !== 'undefined'

const cookieSettings = 'cookieSettings'

const defaultCookieSettings: CookieSettings = {
  hasUserConsent: false,
  [CookieKind.ESSENTIAL]: {
    enabled: true,
    cookies: [
      {
        name: '_tribe_theme',
        company: 'Tribe',
        domains: ['tribe.so', 'tri.be', '*.tribe.so'],
      },
    ],
  },
  [CookieKind.ANALYTICS_AND_FUNCTIONAL]: {
    enabled: false,
    cookies: [
      {
        name: '_tribe_login',
        company: 'Tribe',
        domains: ['tribe.so', 'tri.be', '*.tribe.so'],
      },
      {
        name: '_tribe_session',
        company: 'Tribe',
        domains: ['tribe.so', 'tri.be', '*.tribe.so'],
      },
      {
        name: '_login_id',
        company: 'Google Inc.',
        domains: ['tribe.so', 'tri.be', '*.tribe.so'],
      },
    ],
  },
  [CookieKind.ADVERTISING_AND_TRACKING]: {
    enabled: false,
    cookies: [],
  },
}

type GetUpdatedCookieSettingsParams = {
  cookieKind: OptionalCookieKind
  enabled: boolean
  cookie?: Cookie
}

const getUpdatedCookieSettings = ({
  cookieKind,
  enabled,
  cookie,
}: GetUpdatedCookieSettingsParams): CookieSettings => {
  try {
    const prevSettings = JSON.parse(
      window.localStorage.getItem(cookieSettings) || '""',
    )
    const updatedSettings: CookieSettings = {
      ...prevSettings,
      hasUserConsent: true,
      [cookieKind]: {
        ...prevSettings?.[cookieKind],
        ...cookie,
        enabled,
      },
    }
    return updatedSettings
  } catch (err) {
    logger.error(err)
  }
  return {}
}

export const enableCookie = (cookieKind: OptionalCookieKind) => {
  if (isClient) {
    const updatedSettings = getUpdatedCookieSettings({
      cookieKind,
      enabled: true,
    })
    window.localStorage.setItem(
      cookieSettings,
      JSON?.stringify(updatedSettings),
    )
  }
}

export const enableCookies = (cookieKinds: OptionalCookieKind[]) => {
  if (cookieKinds.length) {
    cookieKinds.forEach(cookieKind => enableCookie(cookieKind))
  }
}

export const disableCookie = (cookieKind: OptionalCookieKind) => {
  if (isClient) {
    const updatedSettings = getUpdatedCookieSettings({
      cookieKind,
      enabled: false,
    })
    window.localStorage.setItem(
      cookieSettings,
      JSON?.stringify(updatedSettings),
    )
  }
}

export const disableCookies = (cookieKinds: OptionalCookieKind[]) => {
  if (cookieKinds.length) {
    cookieKinds.forEach(cookieKind => disableCookie(cookieKind))
  }
}

export const addCookie = (
  cookieKind: OptionalCookieKind,
  enabled: boolean,
  cookie: Cookie,
) => {
  if (isClient) {
    const updatedSettings = getUpdatedCookieSettings({
      cookieKind,
      enabled,
      cookie,
    })
    window.localStorage.setItem(
      cookieSettings,
      JSON?.stringify(updatedSettings),
    )
  }
}

export const setCookieSettings = (newSettings: CookieSettings) =>
  isClient &&
  window.localStorage.setItem(cookieSettings, JSON?.stringify(newSettings))

export const getCookieSettings = (): CookieSettings | undefined => {
  if (isClient) {
    const settings = JSON?.parse(
      window?.localStorage?.getItem(cookieSettings) || '""',
    )
    if (settings) {
      return settings
    }
    setCookieSettings(defaultCookieSettings)
    return defaultCookieSettings
  }
}
