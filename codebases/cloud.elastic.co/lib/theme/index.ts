/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import { mapValues, keyBy } from 'lodash'
import { Store } from 'redux'

import lightThemeVariables from './light'
import darkThemeVariables from './dark'

import { setCookie, getCookie } from '../cookies'

import { setTheme as setThemeAction } from '../../actions/theme'

import LocalStorageKey from '../../constants/localStorageKeys'

import { Theme, ReduxState } from '../../types'

const lightTheme: Theme = `light`
const darkTheme: Theme = `dark`
const darkThemeSelector = `(prefers-color-scheme: dark)`
const euiThemeCookieKey = `EUI_THEME`

const themeVariables = {
  light: lightThemeVariables,
  dark: darkThemeVariables,
}

export function setInitialTheme() {
  const theme = getTheme()

  persistTheme(theme)

  // We use classes like `euiTheme-light` and `euiTheme-dark` to decide on Cloud-owned theme-dependant styles
  document.body.classList.add(`euiTheme-${theme}`)

  for (const stylesheet of getThemeStylesheets()) {
    if (stylesheet.dataset.theme !== theme) {
      stylesheet.parentElement?.removeChild(stylesheet)
    }
  }
}

export function setTheme(theme: Theme) {
  persistTheme(theme)
  window.location.reload()
}

export function getTheme(): Theme {
  const cookieTheme = getCookie(euiThemeCookieKey) as Theme | undefined

  // if there is a cookie, use that
  if (cookieTheme) {
    return cookieTheme
  }

  const legacyLocalStorageTheme = window.localStorage.getItem(
    LocalStorageKey.euiTheme,
  ) as Theme | null

  // we used to store this preference in `localStorage`
  if (legacyLocalStorageTheme) {
    persistTheme(legacyLocalStorageTheme)
    window.localStorage.removeItem(LocalStorageKey.euiTheme)
    return legacyLocalStorageTheme
  }

  // fall back to the system default
  return getSystemPreference()
}

export function getSystemPreference(): Theme {
  try {
    // if there's a system preference for dark mode, go with that
    if (window.matchMedia && window.matchMedia(darkThemeSelector).matches) {
      return darkTheme
    }
  } catch (err) {
    console.warn(err)
  }

  // finally, fall back to light theme
  return lightTheme
}

export function trackColorSchemePreference(store: Store<ReduxState>) {
  try {
    if (!window.matchMedia) {
      return
    }

    window.matchMedia(darkThemeSelector).addListener(onChange)
  } catch (err) {
    console.warn(err)
  }

  function onChange(event) {
    const theme: Theme = event.matches ? `dark` : `light`

    /* Careful! This is harmless because it's unidirectional: we dispatch in an event listener fired by the OS.
     * The reducer calls `setTheme`, so if we were to do this dispatch there, we'd cause an infinite loop.
     */
    store.dispatch(setThemeAction(theme))
  }
}

export function getThemeVariables() {
  const theme = getTheme()
  return themeVariables[theme]
}

export function getThemeColors() {
  const themeVariables = getThemeVariables()
  const colorKeys = Object.keys(themeVariables).filter((key) => key.startsWith(`euiColor`))
  const colors = mapValues(keyBy(colorKeys), (color) => themeVariables[color])
  return colors
}

function persistTheme(theme: Theme) {
  const settings = { expires: 365 * 100, sameSite: `Lax` as const }

  setCookie(euiThemeCookieKey, theme, { settings, topLevel: true })
}

function getThemeStylesheets(): HTMLLinkElement[] {
  // @ts-ignore: We need to target the compiler to ES6 or higher for `NodeListOf<Element>` to be iterable
  return [...document.querySelectorAll('link[data-theme]')]
}
