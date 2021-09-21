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

import { QUERY_CLUSTER_PROXY, CLEAR_CLUSTER_PROXY_RESPONSE } from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

import { EsProxyResponse } from '../../types'

export interface State {
  [descriptor: string]: EsProxyResponse
}

const initialState: State = {}

export default function clusterProxyReducer(state: State = initialState, action) {
  if (action.type === QUERY_CLUSTER_PROXY) {
    if (action.meta.state === `success`) {
      const { clusterId, regionId } = action.meta
      const descriptor = createDescriptor(regionId, clusterId)

      return {
        ...state,
        [descriptor]: action.payload,
      }
    }

    if (action.meta.state === `failed`) {
      const { clusterId, regionId } = action.meta
      const descriptor = createDescriptor(regionId, clusterId)

      return {
        ...state,
        [descriptor]: {
          status: action.payload.response.status,
          statusText: action.payload.response.statusText,
          body: action.payload.body,
          contentType: `json`,
        },
      }
    }
  }

  if (action.type === CLEAR_CLUSTER_PROXY_RESPONSE) {
    const { clusterId, regionId } = action.meta
    const descriptor = createDescriptor(regionId, clusterId)

    return replaceIn(state, [descriptor], undefined)
  }

  return state
}

export function getClusterProxyResponse(
  state: State,
  regionId: string,
  clusterId: string,
): EsProxyResponse | null {
  const descriptor = createDescriptor(regionId, clusterId)
  const response = state[descriptor]

  if (!response) {
    return null
  }

  return response
}

function createDescriptor(regionId: string, clusterId: string): string {
  return `${regionId}/${clusterId}`
}
