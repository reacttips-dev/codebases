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

import { parse, format } from 'url'
import { isEmpty } from 'lodash'
import { parse as parseQuery } from 'query-string'
import jwtDecode from 'jwt-decode'

import { loginUrl, basicLoginUrl, ssoLoginUrl, rootUrl, logoutUrl } from './urlBuilder'

import LocalStorageKey from '../constants/localStorageKeys'

interface JwtBearerToken {
  exp?: number
  okta_session_id?: string
  sub?: string
  sudo?: number
  user_id?: string
}

type HandleUnauthorizedParams = {
  isHeroku?: boolean
  isSkuPicker?: boolean
  location: {
    pathname: string
    search?: string
  }
  setLocation: (redirectUrl: string) => void
}

export function handleUnauthorizedAction({
  isHeroku,
  isSkuPicker,
  location,
  setLocation,
}: HandleUnauthorizedParams): Promise<void> {
  // Token not valid so we remove it and redirect to login
  SAD_clearAuthTokenBits()

  // Redirect to the current location after authentication
  const { pathname, search = `` } = location
  const currentPathname = parse(pathname).pathname

  /* Heroku customers can't auth through our UI, so redirecting them to Login is pointless.
   * We don't handle that route for Heroku customers and a big error is shown anyway.
   * Instead, Heroku customers use specially crafted auth params to log in.
   * See also: `HerokuAppRoot`.
   */
  const noLoginPage = isHeroku || isSkuPicker

  if (noLoginPage) {
    if (currentPathname !== rootUrl()) {
      setLocation(rootUrl())
    }

    return Promise.resolve()
  }

  if (
    currentPathname === loginUrl() ||
    currentPathname === logoutUrl() ||
    currentPathname === basicLoginUrl() ||
    currentPathname === ssoLoginUrl()
  ) {
    return Promise.resolve()
  }

  const redirectTo = encodeURIComponent(pathname + search)

  setLocation(`${logoutUrl()}?redirectTo=${redirectTo}&reason=unauthorised`)
  return Promise.resolve()
}

export function hasAnySsoMethod(authMethods) {
  if (!authMethods) {
    return false
  }

  const { sso_methods } = authMethods

  return !isEmpty(sso_methods)
}

export function hasRedirectOnMount(newBearerToken) {
  return Boolean(newBearerToken) || SAD_hasUnexpiredSession()
}

export function getLoginUrl({ ssoUrl, location }) {
  const locationQuery = parseQuery(location.search.slice(1))
  const { redirectTo } = locationQuery
  const parts = parse(ssoUrl, true)
  const query = parts.query || {}

  parts.query = {
    ...query,
    state: JSON.stringify({ redirectTo }),
  }

  return format(parts)
}

export function getBearerToken(hash: string): string | null {
  const poundlessHash = String(hash).slice(1)
  const hashParams = parseQuery(poundlessHash)
  const newBearerToken = hashParams.bearer_token

  if (typeof newBearerToken !== `string`) {
    return null // the hash might not contain a bearer token, and that's fine
  }

  return newBearerToken
}

export function redirectOnMount({
  redirectAfterLogin,
  redirectTo,
  fromURI,
  logout,
  newBearerToken,
}: {
  redirectAfterLogin: (redirectTo?: string) => void
  redirectTo?: string
  fromURI?: string
  logout?: (fromURI?: string) => void
  newBearerToken: string | null
}) {
  /*If users are coming from Okta (there's a fromURI parameter),
   * and we can assume Okta has already checked and there wasn't a SSO session cookie for them.
   * Even if we have a non-expired JWT token, user needs to re-authenticate.
   */
  if (fromURI && logout) {
    logout(fromURI)
    return
  }
  /* Allows us to receive Basic authentication requests.
   * 1. Server request to https://user:pass@cloud.elastic.co/login/_basic
   * 2. Server redirects to https://cloud.elastic.co/login#bearer_token=$API_BEARER_TOKEN
   * 3. Client persists the bearer token
   */

  if (newBearerToken) {
    SAD_updateAuthTokenBits(newBearerToken)
  }

  /* Besides being useful when we receive a Basic authentication token,
   * the original — and still intended — purpose of this redirect is
   * to not challenge authenticated users with a Login screen.
   */
  const hasSession = SAD_hasUnexpiredSession()

  if (hasSession) {
    redirectAfterLogin(redirectTo)
  }
}

export function getUrlParams(location) {
  const query = parseQuery(location.search.slice(1))
  const { fromURI, redirectTo: redirectRaw } = query

  const oktaRedirectUrl = fromURI && (Array.isArray(fromURI) ? fromURI[0] : fromURI)
  const redirectTo = redirectRaw && (Array.isArray(redirectRaw) ? redirectRaw[0] : redirectRaw)

  return { oktaRedirectUrl, redirectTo }
}

export const SAD_authTokenExpirationLocalStorageKey = `CLOUD_AUTH_EXPIRES`
export const SAD_authTokenSudoExpirationLocalStorageKey = `CLOUD_AUTH_EXPIRES_SUDO`

// Ultimately, our goal is to kill all SAD_* functions and instead rely on the API
// telling us things instead of us having to guess them from the JWT bearer token.
export function SAD_updateAuthTokenBits(token: string) {
  try {
    const decoded = jwtDecode<JwtBearerToken>(token)

    localStorage.setItem(
      SAD_authTokenExpirationLocalStorageKey,
      JSON.stringify(decoded.exp ? decoded.exp * 1000 : null),
    )
    localStorage.setItem(
      SAD_authTokenSudoExpirationLocalStorageKey,
      JSON.stringify(decoded.sudo ? decoded.sudo * 1000 : null),
    )
    localStorage.setItem(`CLOUD_AUTH_USER_ID`, JSON.stringify(decoded.user_id || null))
    localStorage.setItem(`CLOUD_AUTH_USERNAME`, JSON.stringify(decoded.sub || null))
  } catch (err) {
    console.warn(err)
    SAD_clearAuthTokenBits()
  }
}

export function SAD_clearAuthTokenBits() {
  // clear token bits
  localStorage.removeItem(SAD_authTokenExpirationLocalStorageKey)
  localStorage.removeItem(SAD_authTokenSudoExpirationLocalStorageKey)
  localStorage.removeItem(`CLOUD_AUTH_USER_ID`)
  localStorage.removeItem(`CLOUD_AUTH_USERNAME`)

  // Upon logout, forget Heroku cluster
  localStorage.removeItem(LocalStorageKey.herokuCluster)
}

export function SAD_getAuthTokenUserId(): string | null {
  return JSON.parse(localStorage.getItem(`CLOUD_AUTH_USER_ID`) || `null`)
}

export function SAD_getAuthTokenUsername(): string | null {
  return JSON.parse(localStorage.getItem(`CLOUD_AUTH_USERNAME`) || `null`)
}

export function SAD_getAuthTokenExpiration(): Date | null {
  const expiration = JSON.parse(
    localStorage.getItem(SAD_authTokenExpirationLocalStorageKey) || `null`,
  )

  if (expiration) {
    return new Date(expiration)
  }

  return null
}

export function SAD_getAuthTokenSudoExpiration(): Date | null {
  const sudoExpiration = JSON.parse(
    localStorage.getItem(SAD_authTokenSudoExpirationLocalStorageKey) || `null`,
  )

  if (sudoExpiration) {
    return new Date(sudoExpiration)
  }

  return null
}

export function SAD_hasUnexpiredSession(): boolean {
  const expiration = SAD_getAuthTokenExpiration()

  return expiresInTheFuture(expiration)
}

export function SAD_hasUnexpiredSudo(): boolean {
  const sudoExpiration = SAD_getAuthTokenSudoExpiration()

  return expiresInTheFuture(sudoExpiration)
}

export function expiresInTheFuture(date: Date | null): boolean {
  if (!date) {
    return false
  }

  return date.valueOf() > Date.now()
}
