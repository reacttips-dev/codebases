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

import { flatMap, sortBy } from 'lodash'
import { combineReducers } from 'redux'

import createRegion from './createRegion'
import createRegionsFromPlatformInfo from './createRegionsFromPlatformInfo'
import createRegionsFromProviders from './createRegionsFromProviders'

import { FETCH_REGION, FETCH_PROVIDERS, FETCH_PLATFORM } from '../../constants/actions'

import { Action, State, RegionsState, RegionState, RegionIdsState } from './types'

function regionsReducer(state: RegionsState = {}, action: Action): RegionsState {
  if (action.type === FETCH_REGION) {
    if (!action.error && action.payload) {
      const { regionId, selfUrl } = action.meta

      return {
        ...state,
        [regionId]: createRegion(regionId, action.payload, selfUrl),
      }
    }
  }

  if (action.type === FETCH_PLATFORM) {
    if (!action.error && action.payload) {
      const platformInfo = action.payload

      return createRegionsFromPlatformInfo(platformInfo)
    }
  }

  if (action.type === FETCH_PROVIDERS) {
    if (!action.error && action.payload) {
      const providers = action.payload

      return createRegionsFromProviders(providers)
    }
  }

  return state
}

function regionIdsReducer(regions: RegionIdsState = null, action: Action): RegionIdsState {
  if (action.type === FETCH_PLATFORM) {
    if (!action.error && action.payload && !action.meta.regionId) {
      const platformInfo = action.payload
      const regionIds = platformInfo.regions.map((region) => region.region_id)

      return sortBy(regionIds)
    }
  }

  if (action.type === FETCH_PROVIDERS) {
    if (!action.error && action.payload) {
      const providers = action.payload
      const regions = flatMap(providers, (provider) => provider.regions)
      const regionIds = regions.map((region) => region.identifier)

      return sortBy(regionIds)
    }
  }

  return regions
}

export default combineReducers<State>({
  ids: regionIdsReducer,
  entities: regionsReducer,
})

export function getRegionIds(state: State): RegionIdsState {
  return state.ids
}

export function getRegion(state: State, regionId: string): RegionState {
  return state.entities[regionId]
}
