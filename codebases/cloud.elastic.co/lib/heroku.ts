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

import LocalStorageKey from '../constants/localStorageKeys'
import { getConfigForKey } from '../store'

import { HerokuAuthenticationParams } from '../types'

type HerokuAuthenticationQuerystring = {
  domain?: string
  user_id?: string
  cluster_id?: string
  region?: string
  token?: string
  expiry?: string
}

type HerokuClusterParams = {
  regionId: string
  id: string
}

export function parseHerokuAuthenticationParams({
  domain,
  user_id: userId,
  cluster_id: clusterId,
  region: regionId,
  token: authToken,
  expiry: authTokenExpiry,
}: HerokuAuthenticationQuerystring): HerokuAuthenticationParams | null {
  const allDigits = /^\d+$/

  if (domain !== `heroku`) {
    return null
  }

  if (typeof userId !== `string` || !allDigits.test(userId)) {
    return null
  }

  if (typeof clusterId !== `string`) {
    return null
  }

  if (typeof regionId !== `string`) {
    return null
  }

  if (typeof authToken !== `string`) {
    return null
  }

  if (typeof authTokenExpiry !== `string` || !allDigits.test(authTokenExpiry)) {
    return null
  }

  return {
    domain,
    userId: parseInt(userId, 10),
    regionId,
    clusterId,
    authToken,
    authTokenExpiry: new Date(parseInt(authTokenExpiry, 10) * 1000),
  }
}

export function getHerokuHandshakeParams(
  authParams: HerokuAuthenticationParams,
): HerokuAuthenticationQuerystring {
  const { domain, userId, clusterId, regionId, authToken, authTokenExpiry } = authParams

  return {
    domain,
    user_id: String(userId),
    cluster_id: clusterId,
    region: regionId,
    token: authToken,
    expiry: String(authTokenExpiry.valueOf() / 1000),
  }
}

export function getHerokuCluster(): null | HerokuClusterParams {
  const herokuClusterJson = String(localStorage.getItem(LocalStorageKey.herokuCluster))

  try {
    return JSON.parse(herokuClusterJson)
  } catch (err) {
    return null
  }
}

export function isHeroku(): boolean {
  return getConfigForKey(`APP_FAMILY`) === `heroku`
}
