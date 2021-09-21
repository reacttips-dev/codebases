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

import { FETCH_NODE_STATS } from '../constants/actions'

import { ElasticsearchId, RegionId, NodeStats } from '../types'

type Action = {
  type: typeof FETCH_NODE_STATS
  meta: {
    regionId: RegionId
    clusterId: ElasticsearchId
  }
  error?: boolean
  payload?: {
    nodes: { [descriptor: string]: NodeStats }
  }
}

export interface State {
  [descriptor: string]: NodeStats
}

const initialState = {}

export default function nodeStatsReducer(state: State = initialState, action: Action) {
  if (action.type === FETCH_NODE_STATS) {
    if (!action.error && action.payload) {
      const { regionId, clusterId } = action.meta
      const descriptor = createDescriptor(regionId, clusterId)

      return {
        ...state,
        [descriptor]: action.payload.nodes,
      }
    }
  }

  return state
}

export function getNodeStats(
  state: State,
  regionId: RegionId,
  clusterId: ElasticsearchId,
): NodeStats | undefined {
  return state[createDescriptor(regionId, clusterId)]
}

export function getById(
  state: State,
  regionId: RegionId,
  clusterId: ElasticsearchId,
  nodeId: string,
): NodeStats | undefined {
  const allNodeStats = getNodeStats(state, regionId, clusterId)
  return allNodeStats ? allNodeStats[nodeId] : undefined
}

function createDescriptor(regionId: RegionId, clusterId: ElasticsearchId) {
  return `${regionId}/${clusterId}`
}
