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

import Cookies, { CookieAttributes } from 'js-cookie'

export const defaultSettings: CookieAttributes = {
  // transmission over secure HTTPS protocol only, not to be confused with `http-only`
  secure: true,

  // don't share our cookies with third parties by default
  sameSite: `Strict`,

  // cookie is accessible site-wide
  path: '/',
}

export function setCookie(
  name: string,
  value: string,
  {
    settings: userSettings = {},
    topLevel = false,
  }: {
    settings?: Partial<CookieAttributes>
    topLevel?: boolean
  } = {},
): string | undefined {
  const settings: CookieAttributes = {
    ...defaultSettings,
    ...userSettings,
  }

  if (topLevel && areWeOnElasticDotCo()) {
    settings.domain = `.elastic.co`
  }

  // we can't make cookies "secure" over HTTP
  if (location.protocol === `http:`) {
    delete settings.secure
  }

  return Cookies.set(name, value, settings)
}

export function getCookie(name: string): string | undefined {
  return Cookies.get(name)
}

function areWeOnElasticDotCo() {
  const isOnElasticCo = /(?:\.|(^https?:\/\/))elastic\.co$/

  // are we hosted on *.elastic.co or elastic.co?
  return isOnElasticCo.test(location.hostname)
}
