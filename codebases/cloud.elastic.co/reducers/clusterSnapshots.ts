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

import { FETCH_SNAPSHOTS, RESTORE_SNAPSHOT } from '../constants/actions'

import {
  ElasticsearchCluster,
  ClusterSnapshot,
  ClusterSnapshotAction,
  ElasticsearchId,
  RegionId,
} from '../types'

export interface State {
  snapshots: { [descriptor: string]: ClusterSnapshot[] }
  restores: { [descriptor: string]: { success: boolean; raw: any } }
}

const initialState: State = {
  snapshots: {},
  restores: {},
}

function createDescriptor(regionId: RegionId, clusterId: ElasticsearchId) {
  return `${regionId}/${clusterId}`
}

export default function clusterSnapshotsReducer(
  state: State = initialState,
  action: ClusterSnapshotAction,
): State {
  if (action.type === FETCH_SNAPSHOTS) {
    if (!action.error && action.payload) {
      const rawSnapshots = getPayloadSnapshots(action.payload, action.meta.cluster)
      const snapshots = rawSnapshots.slice().reverse() // received order is oldest-first
      const { clusterId, regionId } = action.meta
      const descriptor = createDescriptor(regionId, clusterId)

      return {
        restores: state.restores,
        snapshots: {
          ...state.snapshots,
          [descriptor]: snapshots,
        },
      }
    }
  }

  if (action.type === RESTORE_SNAPSHOT) {
    if (!action.error && action.payload) {
      const success = action.payload.accepted || false
      const { clusterId, regionId } = action.meta
      const descriptor = createDescriptor(regionId, clusterId)

      return {
        snapshots: state.snapshots,
        restores: {
          ...state.restores,
          [descriptor]: {
            success,
            raw: action.payload,
          },
        },
      }
    }
  }

  return state
}

function getPayloadSnapshots(payload, cluster?: ElasticsearchCluster): any[] {
  /* Elasticsearch v8.0.0+ introduced a breaking change whereby snapshots responses
   * are grouped by repository.
   */
  if (Array.isArray(payload.responses)) {
    const repo = cluster && cluster.snapshots && cluster.snapshots.snapshotRepositoryId

    for (const response of payload.responses) {
      /* We might know of a snapshot repository, or we might not. If we don't know,
       * just grab the first response.
       * If we know of a specific repository, try to return results based on it.
       */
      if (repo && response.repository !== repo) {
        continue
      }

      if (Array.isArray(response.snapshots)) {
        return response.snapshots
      }
    }
  }

  return payload.snapshots || []
}

export function getClusterSnapshots(
  state: State,
  regionId: RegionId,
  clusterId: ElasticsearchId,
): ClusterSnapshot[] | null {
  return state.snapshots[createDescriptor(regionId, clusterId)]
}

export function getClusterSnapshotByName(
  state: State,
  regionId: RegionId,
  clusterId: ElasticsearchId,
  name: string,
): ClusterSnapshot | undefined {
  const snapshots = getClusterSnapshots(state, regionId, clusterId)

  return snapshots ? snapshots.find((each) => each.snapshot === name) : undefined
}

export function getSnapshotRestore(
  state: State,
  regionId: RegionId,
  clusterId: ElasticsearchId,
): any | null {
  return state.restores[createDescriptor(regionId, clusterId)]
}
