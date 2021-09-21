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

import createProxies from './createProxies'
import { FETCH_PROXIES } from '../../constants/actions'

import { RegionId, RegionProxies } from '../../types'
import { ProxyOverview } from '../../lib/api/v1/types'

export interface State {
  [regionId: string]: RegionProxies
}

type Action = {
  type: typeof FETCH_PROXIES
  error?: boolean
  payload?: ProxyOverview
  meta: {
    regionId: RegionId
    reqId: string
  }
}

const initialState: State = {}

function regionProxiesReducer(proxy: RegionProxies, action: Action): RegionProxies {
  if (action.type === FETCH_PROXIES) {
    if (!action.error && action.payload) {
      return createProxies(action.payload)
    }
  }

  return proxy
}

export default function proxiesReducer(proxies: State = initialState, action: Action): State {
  if (action.type === FETCH_PROXIES) {
    const { regionId } = action.meta
    return {
      ...proxies,
      [regionId]: regionProxiesReducer(proxies[regionId], action),
    }
  }

  return proxies
}

export function getProxies(state: State, regionId: RegionId): RegionProxies | undefined {
  return state[regionId]
}
