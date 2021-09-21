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

import { flatMap, map } from 'lodash'

import { FETCH_RECOVERY_INFO } from '../../constants/actions'

import { ElasticsearchId, RegionId } from '../../types'
import { FetchRecoveryAction, RecoveryInfo } from './clusterTypes'

export interface State {
  [descriptor: string]: RecoveryInfo[]
}

function createRecoveryInfo(source) {
  return flatMap(source, (index, name) =>
    map(index.shards, (shard) => ({
      id: `${name}-${shard.id}`,
      index: name,
      shard: shard.id,
      type: shard.type,
      stage: shard.stage,
      totalTime: shard.total_time_in_millis / 1000,
      source: {
        host: shard.source.host,
        name: shard.source.name,
      },
      target: {
        host: shard.target.host,
        name: shard.target.name,
      },
      files: {
        total: shard.index.files.total,
        percent: shard.index.files.percent,
      },
      size: {
        total: shard.index.size.total_in_bytes / (1024 * 1024),
        percent: shard.index.size.percent,
      },
    })),
  )
}

function recoveryInfoReducer(recoveryInfo, action) {
  if (action.type === FETCH_RECOVERY_INFO) {
    if (!action.error && action.payload) {
      return createRecoveryInfo(action.payload)
    }
  }

  return recoveryInfo
}

export default function recoveryInfosReducer(
  recoveryInfos: State = {},
  action: FetchRecoveryAction,
) {
  if (action.type !== FETCH_RECOVERY_INFO) {
    return recoveryInfos
  }

  const { regionId, clusterId } = action.meta
  const id = `${regionId}/${clusterId}`

  return {
    ...recoveryInfos,
    [id]: recoveryInfoReducer(recoveryInfos[id], action),
  }
}

export function getRecoveryInfo(state: State, regionId: RegionId, clusterId: ElasticsearchId) {
  return state[`${regionId}/${clusterId}`]
}
