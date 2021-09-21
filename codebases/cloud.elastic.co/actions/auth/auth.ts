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

import { noop, omit } from 'lodash'
import { parse } from 'url'
import jwtDecode from 'jwt-decode'
import { stringify, parse as parseQuery } from 'query-string'

import {
  AUTH_TOKEN,
  FETCH_AUTH_METHODS,
  LOG_IN,
  LOG_OUT,
  REQUIRE_MFA,
  SEND_MFA_CHALLENGE,
  SUBMIT_MFA_RESPONSE,
  AUTH_WITH_OPEN_ID,
  FETCH_JWT_TOKEN,
  RESET_ASYNC_REQUEST,
} from '../../constants/actions'

import { getConfigForKey, isFeatureActivated } from '../../selectors'
import { getConfigForKey as getStaticConfigForKey } from '../../store'

import asyncRequest, { resetAsyncRequest, asyncRequestActions } from '../asyncRequests'

import { getAuthenticationInfo } from '../../reducers'

import history from '../../lib/history'
import { setCookie, getCookie } from '../../lib/cookies'
import { post } from '../../lib/ajax'
import { captureApmError } from '../../lib/apm'

import { loginUrl, rootUrl } from '../../lib/urlBuilder'
import { MarketoParamsType } from '../../lib/urlUtils'
import {
  challengeSaasCurrentUserMfaDeviceUrl,
  logoutUrl,
  methodsUrl,
  verifySaasCurrentUserMfaChallengeUrl,
} from '../../lib/api/v1/urls'

import getRandomValues from '../../lib/randomValues'

import { reqIdFactory } from '../../lib/reqId'
import { getMarketoTrackingParamsFromCookies } from '../../lib/marketo'

import Feature from '../../lib/feature'

import { Action, CloudAppConfig, ReduxState, ThunkAction, ThunkDispatch } from '../../types'
import { AccountResponse } from '../../lib/api/v1/types'

interface SetTokenAction extends Action<typeof AUTH_TOKEN> {
  payload: {
    token: string
  }
}

interface TokenData {
  okta_session_id: string
}

export interface OpenIdLoginArgs extends MarketoParamsType {
  fromURI?: string
  settings?: string
  source?: RegistrationSource
  referrer: string
}

type ConfigKey = Feature | keyof CloudAppConfig

export interface OpenIdConfigs {
  oktaClientIdKey: ConfigKey
  oktaIdpKey: ConfigKey
}

export interface LoginArgs {
  oktaRedirectUrl?: string
  redirectTo?: string
  credentials: { email: string; password: string }
}

export type RegistrationSource =
  | 'training'
  | 'training-checkout'
  | 'training-courses'
  | 'cloud'
  | 'community-contributions'
  | 'community-events'
  | 'support'
  | 'partners'
  | undefined

const oktaSessionRedirect = ({ oktaSessionId, redirectTo }) => {
  const oktaBaseUrl = getStaticConfigForKey(`OKTA_URL`)
  const oktaPath = `/login/sessionCookieRedirect?`
  const oktaQuery = stringify({
    token: oktaSessionId,
    redirectUrl: createOktaRedirectUrl(redirectTo),
  })

  window.location.replace(`${oktaBaseUrl}${oktaPath}${oktaQuery}`)
}

const createOktaRedirectUrl = (redirectTo?: string) => {
  if (redirectTo && parse(redirectTo).protocol) {
    return redirectTo
  }

  const { origin, protocol, hostname, port } = window.location
  const redirectUrl = origin || `${protocol}//${hostname}${port ? `:${port}` : ``}`
  return redirectTo ? `${redirectUrl}${redirectTo}` : redirectUrl
}

const handleOktaSessionRedirect = (dispatch, { token, okta_session_id, redirectTo }) => {
  if (token) {
    dispatch(saveToken(token))
    const decoded = jwtDecode<TokenData>(token)
    oktaSessionRedirect({ oktaSessionId: decoded.okta_session_id, redirectTo })
  } else if (okta_session_id) {
    oktaSessionRedirect({ oktaSessionId: okta_session_id, redirectTo })
  }
}

export const handleLoginRedirect = (dispatch, { token, redirectTo }) => {
  if (token) {
    dispatch(saveToken(token))
    dispatch(redirectAfterLogin(redirectTo))
  }
}

function checkForOktaAndHandleLogin(
  dispatch,
  oktaAuthenticationEnabled,
  { token, okta_session_id, redirectTo, oktaRedirectUrl },
) {
  if (oktaAuthenticationEnabled) {
    // In most use cases, a token would be returned
    // However @elastic.co users need to be verified to authenticate on ESS
    if (!token && okta_session_id && !oktaRedirectUrl) {
      return { isUnverifiedUser: true }
    }

    handleOktaSessionRedirect(dispatch, {
      token,
      okta_session_id,
      redirectTo: oktaRedirectUrl || redirectTo,
    })
  } else {
    handleLoginRedirect(dispatch, { token, redirectTo })
  }

  return null
}

const createRedirectPath = (path) =>
  path == null || parse(path).pathname === loginUrl() ? rootUrl() : path

export const redirectAfterLogin = (newPath) => () => {
  if (newPath) {
    const path = parse(newPath)

    if (path.hostname) {
      return window.location.replace(newPath)
    }
  }

  return history.replace(createRedirectPath(newPath))
}

export function saveToken(token: string): SetTokenAction {
  return {
    type: AUTH_TOKEN,
    meta: {},
    payload: { token },
  }
}

export function loginAndRedirect({
  oktaRedirectUrl,
  redirectTo,
  credentials,
}: LoginArgs): ThunkAction {
  return (dispatch, getState) => {
    const state = getState()
    const url = getConfigForKey(state, `LOGIN_URL`)
    const oktaAuthenticationEnabled = isFeatureActivated(state, Feature.oktaAuthenticationEnabled)

    return (
      dispatch(
        asyncRequest({
          type: LOG_IN,
          method: `POST`,
          url,
          payload: credentials,
        }),
      )
        .then(({ payload }) => {
          const { token, mfa_required, okta_session_id } = payload

          if (mfa_required) {
            dispatch({
              type: REQUIRE_MFA,
              meta: {},
              payload,
            })
          } else {
            return checkForOktaAndHandleLogin(dispatch, oktaAuthenticationEnabled, {
              token,
              okta_session_id,
              redirectTo,
              oktaRedirectUrl,
            })
          }

          return payload
        })

        // Don't allow rejected promises to propagate. They have
        // a similar effect to uncaught exceptions in the integration tests.
        .catch(noop)
    )
  }
}

export function sendMfaChallenge({ device_id, state_id }) {
  const url = challengeSaasCurrentUserMfaDeviceUrl({ deviceId: device_id })

  const payload = {
    state_id,
  }
  return asyncRequest({
    type: SEND_MFA_CHALLENGE,
    method: `POST`,
    url,
    payload,
  })
}

export function submitMfaResponse({ oktaRedirectUrl, redirectTo, device_id, state_id, pass_code }) {
  return (dispatch: ThunkDispatch, getState: () => ReduxState) => {
    const state = getState()
    const oktaAuthenticationEnabled = isFeatureActivated(state, Feature.oktaAuthenticationEnabled)
    const url = verifySaasCurrentUserMfaChallengeUrl({ deviceId: device_id })

    return dispatch(
      asyncRequest({
        type: SUBMIT_MFA_RESPONSE,
        method: `POST`,
        url,
        payload: { state_id, pass_code },
      }),
    ).then(({ payload }) => {
      const { token, okta_session_id } = payload

      return checkForOktaAndHandleLogin(dispatch, oktaAuthenticationEnabled, {
        token,
        okta_session_id,
        redirectTo,
        oktaRedirectUrl,
      })
    })
  }
}

export const resetSubmitMfaResponseRequest = () => resetAsyncRequest(SUBMIT_MFA_RESPONSE)

export const clearAuthToken = () => ({
  type: LOG_OUT,
})

export function logout({ fromURI, redirectTo }: { fromURI?: string; redirectTo?: string }) {
  return (dispatch, getState) => {
    const state = getState()
    const isAnyAdminconsole = getConfigForKey(state, `APP_NAME`) === `adminconsole`
    const isHeroku = getConfigForKey(state, `APP_FAMILY`) === `heroku`
    const loggedOutUrl = isHeroku ? rootUrl() : getLoginUrl()

    /* We dispatch the browser logout action after we send the server logout request.
     * Logging out from the browser clears the auth token in Redux,
     * but that token is needed for the server logout request.
     */
    return serverLogout().then(browserLogout, browserLogoutAfterError)

    function serverLogout() {
      // On any adminconsole's side, just calling the server logout endpoint is enough
      if (isAnyAdminconsole) {
        return post(logoutUrl())
      }

      // On pyconsole's side, this ends up in the `POST /api/v1/saas/auth/_logout` handler
      // which is meant for customers and deals with Okta MFA, etc.
      return post(`/api/v1/users/_logout`)
    }

    function browserLogoutAfterError(serverLogoutError) {
      captureApmError(serverLogoutError)
      browserLogout()
    }

    function browserLogout() {
      dispatch(clearAuthToken())

      /*If users are coming from Okta (there's a fromURI parameter),
       * and we can assume Okta has already checked and there wasn't a SSO session cookie for them.
       * So we just logout and redirect to logged out url with the fromURI parameter
       */
      if (isFeatureActivated(state, Feature.oktaAuthenticationEnabled) && !fromURI) {
        logoutThroughOkta()
      } else {
        goToLoggedOutPage()
      }
    }

    function logoutThroughOkta() {
      const oktaBaseUrl = getStaticConfigForKey(`OKTA_URL`)
      const oktaSignoutQuery = stringify({
        fromURI: createOktaRedirectUrl(loggedOutUrl),
      })
      const oktaSignoutUrl = `${oktaBaseUrl}/login/signout?${oktaSignoutQuery}`

      window.location.replace(oktaSignoutUrl)
    }

    function goToLoggedOutPage() {
      // Reload to ensure the redux state is cleared
      window.location.replace(getLoggedOutUrl())
    }

    function getLoggedOutUrl() {
      if (!fromURI) {
        return loggedOutUrl
      }

      const query = stringify({ fromURI })
      return `${loggedOutUrl}?${query}`
    }

    function getLoginUrl() {
      if (!redirectTo) {
        return loginUrl()
      }

      const query = stringify({ redirectTo })
      return `${loginUrl()}?${query}`
    }
  }
}

export function refreshToken() {
  return (dispatch, getState) => {
    const refreshTokenUrl = getRefreshTokenUrl(getState())

    if (refreshTokenUrl === null) {
      return Promise.resolve() // sanity
    }

    return post(refreshTokenUrl).then(updateToken)

    function updateToken({ body: { token } }) {
      return dispatch(saveToken(token))
    }
  }
}

function getRefreshTokenUrl(state) {
  const authenticationInfo = getAuthenticationInfo(state)

  if (!authenticationInfo) {
    return null
  }

  return authenticationInfo.refresh_token_url
}

export function fetchAuthMethods(): ThunkAction<Promise<AccountResponse>> {
  return asyncRequest({
    type: FETCH_AUTH_METHODS,
    method: `GET`,
    url: methodsUrl(),
  })
}

export function loginWithGoogle(
  openIdLoginArgs: OpenIdLoginArgs,
): (dispatch: any, getState: () => ReduxState) => void {
  return loginWithOpenId(openIdLoginArgs, {
    oktaClientIdKey: 'OKTA_GOOGLE_CLIENT_ID',
    oktaIdpKey: 'OKTA_GOOGLE_IDP',
  })
}

export function loginWithAzure(
  openIdLoginArgs: OpenIdLoginArgs,
): (dispatch: any, getState: () => ReduxState) => void {
  return loginWithOpenId(openIdLoginArgs, {
    oktaClientIdKey: 'OKTA_AZURE_CLIENT_ID',
    oktaIdpKey: 'OKTA_AZURE_IDP',
  })
}

export function extractIdpFromCookie(): string | null {
  const cookieState = getCookie('openIdState')

  if (!cookieState) {
    return null
  }

  const { oktaIdpKey } = parseQuery(cookieState)

  if (!oktaIdpKey) {
    return null
  }

  return getStaticConfigForKey(oktaIdpKey as ConfigKey)
}

function loginWithOpenId(
  openIdLoginArgs: OpenIdLoginArgs,
  { oktaClientIdKey, oktaIdpKey }: OpenIdConfigs,
) {
  return (dispatch) => {
    const oktaBaseUrl = getStaticConfigForKey(`OKTA_URL`)!
    const clientId = getStaticConfigForKey(oktaClientIdKey)!
    const idp = getStaticConfigForKey(oktaIdpKey)!

    const domain = createOktaRedirectUrl()
    const nonceState = getRandomValues()

    const cookie = stringify({
      oktaIdpKey,
      nonceState,
      ...openIdLoginArgs,
    })

    const url = createOpenIdRedirectUrl({
      idp,
      clientId,
      oktaBaseUrl,
      domain,
      cookie,
    })

    dispatch(startAuthWithOpenId(cookie))
    window.location.assign(url)
  }
}

function createOpenIdRedirectUrl({
  idp,
  clientId,
  domain,
  oktaBaseUrl,
  cookie,
}: {
  idp: string
  clientId: string
  domain: string
  oktaBaseUrl: string
  cookie: string
}) {
  const oktaPath = `/oauth2/default/v1/authorize`

  const queryString = stringify({
    idp,
    client_id: clientId,
    response_type: `code`,
    response_mode: `fragment`,
    scope: `openid email profile`,
    redirect_uri: `${domain}/login/oauth`,
    state: cookie,
  })

  return `${oktaBaseUrl}${oktaPath}?${queryString}`
}

export const startAuthWithOpenId = (state: string) => {
  setCookie('openIdState', state, {
    settings: {
      sameSite: `Lax`,
    },
  })

  return {
    type: AUTH_WITH_OPEN_ID,
  }
}

export function authorizeSaasOauthToken(args: {
  state: string | null
  code: string | null
  idp_id: string
}): ThunkAction | undefined {
  const { state, idp_id, code } = args

  if (!state || !code) {
    return
  }

  const query = parseQuery(state)

  const { nonceState: stateFromUrl } = query
  const cookieState = getCookie('openIdState')

  if (!cookieState) {
    return invalidState()
  }

  const { nonceState, fromURI, source, settings, oktaIdpKey, ...rest } = parseQuery(cookieState)
  const trackingData = oktaIdpKey ? omit(rest, oktaIdpKey) : rest

  if (stateFromUrl !== nonceState) {
    return invalidState()
  }

  const url = `/api/v1/saas/auth/oauth/_callback`

  const reqPayload = {
    idp_id,
    code,
    redirect_uri: createOktaRedirectUrl(`/login/oauth`),
    ...(source ? { source } : {}),
    ...(settings ? { settings } : {}),
    tracking_data: {
      ...trackingData,
      ...getMarketoTrackingParamsFromCookies(),
    },
  }

  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: FETCH_JWT_TOKEN,
        method: `POST`,
        payload: reqPayload,
        url,
      }),
    ).then((response) => {
      const { payload } = response
      const { token } = payload

      return handleLoginRedirect(dispatch, { token, redirectTo: fromURI })
    })

  function invalidState() {
    const { failed } = asyncRequestActions({
      type: FETCH_JWT_TOKEN,
      reqId: reqIdFactory(FETCH_JWT_TOKEN)(),
    })

    return (dispatch) =>
      dispatch(
        failed({
          code: 403,
          message: `Incorrect state`,
        }),
      )
  }
}

export const resetLoginRequest = (): Action<typeof RESET_ASYNC_REQUEST> => resetAsyncRequest(LOG_IN)
export const resetAuthorizeSaasOauthTokenRequest = (): Action<typeof RESET_ASYNC_REQUEST> =>
  resetAsyncRequest(FETCH_JWT_TOKEN)
