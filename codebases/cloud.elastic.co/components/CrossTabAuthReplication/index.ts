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

import { Component } from 'react'
import { off, on } from 'local-storage'
import { parse } from 'query-string'

import {
  SAD_authTokenExpirationLocalStorageKey,
  SAD_authTokenSudoExpirationLocalStorageKey,
  expiresInTheFuture,
} from '../../lib/auth'
import { loginUrl } from '../../lib/urlBuilder'

interface Props {}

type NullableNumber = number | null

const featureDetectedSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

/* There are a few scenarios that can lead to `CrossTabAuthReplication` event listeners:
 * [1] User logs in
 * [2] User logs out
 * [3] User grabs sudo
 * [4] User drops sudo
 * [5] Token gets refreshed via `RefreshApiToken`
 *
 * In all of the above scenarios — except for [5] — we want to reload the page.
 * If the user had a valid token, and they now have a different valid token of the same kind,
 * nothing changes, and we avoid eagerly doing a full page reload, which is annoying to users
 *
 * [1] [2] are governed by changes to the expiration between the previous token and the next
 * [3] [4] are governed by changes to the _sudo_ expiration between the previous token and the next
 */
export default class CrossTabAuthReplication extends Component<Props> {
  componentDidMount(): void {
    // Safari fires storage events in the same tab where changes originate, causing issues
    // https://bugs.webkit.org/show_bug.cgi?id=210512
    if (featureDetectedSafari) {
      return
    }

    on<NullableNumber>(SAD_authTokenExpirationLocalStorageKey, this.onExpirationChange)
    on<NullableNumber>(SAD_authTokenSudoExpirationLocalStorageKey, this.onSudoExpirationChange)
  }

  componentWillUnmount(): void {
    off<NullableNumber>(SAD_authTokenExpirationLocalStorageKey, this.onExpirationChange)
    off<NullableNumber>(SAD_authTokenSudoExpirationLocalStorageKey, this.onSudoExpirationChange)
  }

  render(): null {
    return null
  }

  onExpirationChange = (nextExpiration: number | null, prevExpiration: number | null): void => {
    const expirationStateChanged = this.hasExpirationStateChange(nextExpiration, prevExpiration)

    if (expirationStateChanged) {
      fullPageReload() // [1] [2]
    }
  }

  onSudoExpirationChange = (
    nextSudoExpiration: number | null,
    prevSudoExpiration: number | null,
  ): void => {
    const sudoExpirationStateChanged = this.hasExpirationStateChange(
      nextSudoExpiration,
      prevSudoExpiration,
    )

    if (sudoExpirationStateChanged) {
      fullPageReload() // [3] [4]
    }
  }

  hasExpirationStateChange(nextExpiration: number | null, prevExpiration: number | null): boolean {
    if (nextExpiration === prevExpiration) {
      return false
    }

    const nextDate = nextExpiration ? new Date(nextExpiration) : null
    const prevDate = prevExpiration ? new Date(prevExpiration) : null

    // Token was expired and now is not, or token was unexpired and now is not
    const stateChanged = expiresInTheFuture(nextDate) !== expiresInTheFuture(prevDate)

    return stateChanged
  }
}

export function fullPageReload() {
  const { origin, pathname, search } = window.location
  const query = parse(search)
  const fromURI = query.fromURI as string

  /* A full page reload is useful when logging in/out or obtaining/dropping sudo,
   * as we might have previously loaded data that has become inconsistent with
   * the new credentials, leading to an uncertain UI state.
   */
  if (pathname === loginUrl() && fromURI) {
    /* pathname /login?fromURI=<fromURI> triggers a logout() event because
     * if users land on '/login' path and are coming from Okta there's a fromURI parameter
     * which informs the app to do so - https://github.com/elastic/cloud/issues/64582.
     * Hence in this case we redirect the user to the value of fromURI - https://github.com/elastic/cloud/issues/77272
     */
    const redirectTo =
      fromURI.startsWith('http://') || fromURI.startsWith('https://')
        ? fromURI
        : `${origin}${fromURI}`
    window.location.replace(redirectTo)
  } else {
    window.location.reload()
  }
}
