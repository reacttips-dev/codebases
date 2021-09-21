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

import { keyBy } from 'lodash'

import { FETCH_PLATFORM } from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

import { AsyncAction } from '../../types'
import { PlatformInfo, RegionInfo } from '../../lib/api/v1/types'

export type State = {
  overview: PlatformInfo | null
  regionInfos: {
    [regionId: string]: RegionInfo | null
  }
  regions: {
    [regionId: string]: PlatformInfo
  }
}

type FetchPlatformAction = AsyncAction<typeof FETCH_PLATFORM, PlatformInfo>

export const initialState: State = {
  overview: null,
  regionInfos: {},
  regions: {},
}

export default function platformReducer(
  state: State = initialState,
  action: FetchPlatformAction,
): State {
  if (action.type === FETCH_PLATFORM) {
    if (action.payload && !action.error) {
      const { regionId } = action.meta

      if (!regionId) {
        const updatedOverview = replaceIn(state, [`overview`], action.payload)
        const updatedRegions = replaceIn(
          updatedOverview,
          [`regionInfos`],
          keyBy(action.payload.regions, 'region_id'),
        )

        return updatedRegions
      }

      const updatedOverview = replaceIn(state, [`regions`, regionId], action.payload)
      const updatedRegion = replaceIn(
        updatedOverview,
        [`regionInfos`, regionId],
        action.payload.regions.find((region) => region.region_id === regionId),
      )

      return updatedRegion
    }
  }

  return state
}

export function getPlatformOverview(state: State): PlatformInfo | null {
  return state.overview || null
}

export function getRegionInfo(state: State, regionId: string): RegionInfo | null {
  return state.regionInfos[regionId] || null
}

export function getPlatformByRegion(state: State, regionId: string): PlatformInfo | null {
  return state.regions[regionId] || null
}
