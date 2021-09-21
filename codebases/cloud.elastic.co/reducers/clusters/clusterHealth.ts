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

import { get, set } from 'lodash'
import { FETCH_CLUSTER_HEALTH, FETCH_SHARD_COUNTS } from '../../constants/actions'

import { ElasticsearchId, RegionId } from '../../types'
import { ClusterHealth, ClusterHealthAction, ClusterShardDetail } from './clusterTypes'

export interface State {
  [descriptor: string]: ClusterHealth | null
}

const createClusterHealth = (source) => ({
  status: source.status,
  shards: {
    unassigned: source.unassigned_shards,
    initializing: source.initializing_shards,
    relocating: source.relocating_shards,
  },
})

function createShardDetail(source): ClusterShardDetail {
  return source.reduce((result, shard) => {
    const path: string[] = [shard.state]

    if (shard.state === `UNASSIGNED`) {
      path.push(shard[`unassigned.reason`])
    }

    set(result, path, get(result, path, 0) + 1)
    return result
  }, {})
}

function clusterHealthReducer(
  clusterState: ClusterHealth | null = null,
  action,
): ClusterHealth | null {
  switch (action.type) {
    case FETCH_CLUSTER_HEALTH:
      return {
        ...clusterState,
        ...createClusterHealth(action.payload),
      }

    case FETCH_SHARD_COUNTS:
      return {
        ...clusterState!, // I think the order of data fetch makes this type assertion true, fingers crossed
        shardDetail: createShardDetail(action.payload),
      }

    default:
      return clusterState
  }
}

export default function clusterHealthsReducer(
  state: State = {},
  action: ClusterHealthAction,
): State {
  if (action.error || !action.payload) {
    return state
  }

  switch (action.type) {
    case FETCH_CLUSTER_HEALTH:
    case FETCH_SHARD_COUNTS:
      const { regionId, clusterId } = action.meta
      const id = `${regionId}/${clusterId}`

      return {
        ...state,
        [id]: clusterHealthReducer(state[id], action),
      }

    default:
      return state
  }
}

export function getClusterHealth(state: State, regionId: RegionId, clusterId: ElasticsearchId) {
  return state[`${regionId}/${clusterId}`]
}
