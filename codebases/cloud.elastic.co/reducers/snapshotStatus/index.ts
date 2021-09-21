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

import { FETCH_SNAPSHOT_STATUS } from '../../constants/actions'

import {
  ClusterSnapshotStatus,
  ClusterSnapshotStatusAction,
  ElasticsearchId,
  RegionId,
} from '../../types'

export type State = { [descriptor: string]: ClusterSnapshotStatus }

const initialState = {}

function createDescriptor(regionId: RegionId, clusterId: ElasticsearchId, snapshotId: string) {
  return `${regionId}/${clusterId}/${snapshotId}`
}

export default function snapshotStatusReducer(
  state: State = initialState,
  action: ClusterSnapshotStatusAction,
): State {
  switch (action.type) {
    case FETCH_SNAPSHOT_STATUS: {
      if (!action.error && action.payload != null) {
        const { clusterId, regionId, snapshotId } = action.meta
        const descriptor = createDescriptor(regionId, clusterId, snapshotId)
        return {
          [descriptor]: action.payload.snapshots[0],
        }
      }

      break
    }

    default:
      break
  }

  return state
}

export function getSnapshotStatus(
  state: State,
  regionId: RegionId,
  clusterId: ElasticsearchId,
  snapshotId: string,
) {
  return state[createDescriptor(regionId, clusterId, snapshotId)]
}
