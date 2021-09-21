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

import {
  FETCH_SNAPSHOT_SETTINGS,
  SET_SNAPSHOT_SETTINGS,
  UPDATE_SNAPSHOT_SETTINGS,
} from '../../constants/actions'

import { parseWeirdApiTime } from '../../lib/weirdTime'
import { replaceIn } from '../../lib/immutability-helpers'

import {
  Action,
  AsyncAction,
  DeploymentSnapshotState,
  ElasticsearchId,
  RegionId,
  SetSnapshotSettings,
} from '../../types'

import { ClusterSnapshotSettings } from '../../lib/api/v1/types'

export interface State {
  [regionAndDeploymentId: string]: DeploymentSnapshotState
}

interface FetchSnapshotSettingsAction
  extends AsyncAction<typeof FETCH_SNAPSHOT_SETTINGS, ClusterSnapshotSettings> {
  meta: {
    regionId: RegionId
    clusterId: ElasticsearchId
    state: 'started' | 'failed' | 'success'
  }
}

interface UpdateSnapshotSettingsAction
  extends AsyncAction<typeof UPDATE_SNAPSHOT_SETTINGS, ClusterSnapshotSettings> {
  meta: {
    regionId: RegionId
    clusterId: ElasticsearchId
    state: 'started' | 'failed' | 'success'
  }
}

interface SetSnapshotSettingsAction extends Action<typeof SET_SNAPSHOT_SETTINGS> {
  meta: {
    regionId: RegionId
    clusterId: ElasticsearchId
    state: never
  }
  payload: SetSnapshotSettings
}

type SnapshotAction =
  | FetchSnapshotSettingsAction
  | UpdateSnapshotSettingsAction
  | SetSnapshotSettingsAction

export default function snapshotSettingsReducer(state: State = {}, action: SnapshotAction): State {
  if (action.type === FETCH_SNAPSHOT_SETTINGS || action.type === UPDATE_SNAPSHOT_SETTINGS) {
    if (action.meta.state === `success` && action.payload) {
      const {
        payload,
        meta: { regionId, clusterId },
      } = action

      const snapshots =
        payload.retention && payload.retention.snapshots ? payload.retention.snapshots : 100

      const { unit, value } = parseWeirdApiTime(payload.interval)

      const maxAge =
        payload.retention && payload.retention.max_age
          ? payload.retention.max_age
          : `${snapshots * value}${unit}`

      const desc = createDescriptor(regionId, clusterId)

      return {
        ...state,
        [desc]: {
          ...payload,
          interval: {
            value,
            unit,
          },
          retention: {
            maxAge,
            snapshots,
          },
        },
      }
    }
  }

  if (action.type === SET_SNAPSHOT_SETTINGS) {
    const { regionId, clusterId } = action.meta
    const desc = createDescriptor(regionId, clusterId)

    return replaceIn(
      replaceIn(state, [desc, 'interval'], action.payload.interval),
      [desc, 'retention'],
      action.payload.retention,
    )
  }

  return state
}

function createDescriptor(regionId: RegionId, clusterId: ElasticsearchId) {
  return `${regionId}/${clusterId}`
}

export const snapshotSetting = (state: State, regionId: RegionId, clusterId: ElasticsearchId) => {
  const descriptor = createDescriptor(regionId, clusterId)
  return state[descriptor]
}
