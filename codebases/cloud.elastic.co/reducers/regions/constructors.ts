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

import { map, get, isEmpty } from 'lodash'

import { FETCH_REGION, FETCH_PLATFORM } from '../../constants/actions'

import { Action } from './types'

import { RegionInfo } from '../../lib/api/v1/types'

export type Constructor = {
  regionId: string
  id: string
  connected: boolean
  maintenance: boolean
  shortCommitHash: string | null
  version: string | null
}

export type Constructors = {
  healthy: boolean
  constructors: Constructor[]
}

export type State = {
  [regionId: string]: Constructors | undefined
}

export default function regionsConstructorsReducer(state: State = {}, action: Action): State {
  if (action.type === FETCH_REGION) {
    if (!action.error && action.payload) {
      const { regionId } = action.meta

      return {
        ...state,
        [regionId]: createConstructorsFromFetchRegionResponse(regionId, action.payload),
      }
    }
  }

  if (action.type === FETCH_PLATFORM) {
    if (!action.error && action.payload) {
      const { regions } = action.payload

      return regions.reduce(
        (state, region) => ({
          ...state,
          [region.region_id]: createConstructorsFromFetchPlatformResponse(region),
        }),
        state,
      )
    }
  }

  return state
}

function createConstructorsFromFetchRegionResponse(regionId: string, payload): Constructors {
  /* in UC, we don't see this information, let's just pretend it's healthy
   * UC won't consume this data, in any case, so this is a safe compromise.
   */
  if (isEmpty(get(payload, [`constructors`, `constructors`]))) {
    return {
      healthy: true,
      constructors: [],
    }
  }

  const {
    constructors: { healthy, constructors },
  } = payload

  return {
    healthy,
    constructors: map(constructors, createConstructor),
  }

  function createConstructor(ctor, id): Constructor {
    const { connected, maintenance, data } = ctor

    const shortCommitHash = get(data, [`build`, `shortCommitHash`], null)
    const version = get(data, [`build`, `version`], null)

    return {
      regionId,
      id,
      connected,
      maintenance,
      shortCommitHash,
      version,
    }
  }
}

function createConstructorsFromFetchPlatformResponse(region: RegionInfo): Constructors {
  return {
    healthy: region.constructors.constructors.every((constructor) => constructor.status.connected),
    constructors: region.constructors.constructors.map((constructor) => ({
      regionId: region.region_id,
      id: constructor.constructor_id,
      connected: constructor.status.connected,
      maintenance: constructor.status.maintenance_mode,
      shortCommitHash: null,
      version: null,
    })),
  }
}

export function getConstructors(state: State, regionId: string) {
  return state[regionId]
}
