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

import { get } from 'lodash'

import { FETCH_HAPPY_SAD_CLUSTERS } from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

export type State = {
  [regionId: string]: RegionState
}

type ConstructorState = {
  id: string
  shortCommitHash: string | null
  version: string | null
}

export type RegionState = {
  elasticsearch: {
    healthy: number
    happy: number
    sad: number
  }
  kibana: {
    healthy: number
    happy: number
    sad: number
  }
  constructors: ConstructorState[]
}

const initialState: State = {}

export default function happySadClustersReducer(state: State = initialState, action) {
  if (action.type === FETCH_HAPPY_SAD_CLUSTERS) {
    if (action.payload && !action.error) {
      const { regionId } = action.meta
      const constructors = get(action.payload, [`constructors`, `constructors`], {})

      return replaceIn(state, [regionId], {
        elasticsearch: {
          healthy: get(action.payload, [`clusters`, `healthy`], true),
          happy: get(action.payload, [`clusters`, `happy_count`], 0),
          sad: get(action.payload, [`clusters`, `sad_count`], 0),
        },
        kibana: {
          healthy: get(action.payload, [`kibana_clusters`, `healthy`], true),
          happy: get(action.payload, [`kibana_clusters`, `happy_count`], 0),
          sad: get(action.payload, [`kibana_clusters`, `sad_count`], 0),
        },
        constructors: Object.keys(constructors).map((id) => ({
          id,
          shortCommitHash: get(constructors[id], [`data`, `build`, `shortCommitHash`], null),
          version: get(constructors[id], [`data`, `build`, `version`], null),
        })),
      })
    }
  }

  return state
}

export function getHappySadClusters(state: State, regionId: string): RegionState | undefined {
  return state[regionId]
}
