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

import { mapValues, keyBy, pickBy } from 'lodash'
import { getCookie, setCookie } from './cookies'

import { Dictionary, PlainHashMap } from '../types'

/*
This spreadsheet shows the expected cookies and Query String parameters that Marketo expects:
https://docs.google.com/spreadsheets/d/1gRFUoEaytSMusm2bz6T_8hAI77cEWM4WsxVYhNoGtIk/edit#gid=0
 */
export const marketoQueryToCookieKeys = {
  elektra: 'mktg_pg',
  storm: 'mktg_plcmt',
  ultron: 'mktg_camp',
  blade: 'mktg_src',
  hulk: 'mktg_mdm',
  gambit: 'mktg_cnt',
  thor: 'mktg_trm',
  baymax: 'mktg_tech',
  rogue: 'mktg_cta',
}

export const marketoCookieKeys = [
  'mktg_camp',
  'mktg_cnt',
  'mktg_cta',
  'mktg_gclid',
  'mktg_q',
  'mktg_mdm',
  'mktg_pg',
  'mktg_plcmt',
  'mktg_src',
  'mktg_tech',
  'mktg_trm',
  'u',
]

const marketoQueryKeys = Object.keys(marketoQueryToCookieKeys)

export function resetMarketoCookies(queryStringParams: PlainHashMap): void {
  const queryStringKeys = Object.keys(queryStringParams)
  const marketoKeys = queryStringKeys.filter((key) => marketoQueryKeys.includes(key))

  for (const qsKey of marketoKeys) {
    const name = marketoQueryToCookieKeys[qsKey]
    const value = queryStringParams[qsKey]
    const settings = { expires: 30, sameSite: `Lax` as const }

    setCookie(name, value, { settings, topLevel: true })
  }
}

export function getMarketoTrackingParamsFromCookies(): Dictionary<string | undefined> {
  return pickBy(mapValues(keyBy(marketoCookieKeys), getCookie))
}
