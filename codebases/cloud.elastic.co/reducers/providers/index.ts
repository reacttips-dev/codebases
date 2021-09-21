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

import { find, flatMap, keyBy } from 'lodash'

import { FETCH_PROVIDERS } from '../../constants/actions'

import { PlatformId } from '../../lib/platform'

export type RegionState = {
  identifier: string
  name: string
  features: string[]
  is_default?: boolean
}
export type ProviderState = { regions: RegionState[]; name: PlatformId; is_default?: boolean }

export type State = ProviderState[]

export type FetchProvidersAction = {
  type: typeof FETCH_PROVIDERS
  error?: string
  payload?: State
}

export default function providersReducer(state: State = [], action: FetchProvidersAction) {
  if (action.type === FETCH_PROVIDERS) {
    if (!action.error && action.payload) {
      return action.payload
    }
  }

  return state
}

export const getRegionsByProvider = (
  state: State,
  providerId: PlatformId,
): RegionState[] | null => {
  const currentProvider = find(state, (stateProvider) => stateProvider.name === providerId)

  if (currentProvider) {
    return currentProvider.regions
  }

  return []
}

export const getRegionIdsByProvider = (state: State, providerId: PlatformId): string[] => {
  const regions = getRegionsByProvider(state, providerId)

  if (!regions) {
    return []
  }

  return regions.map(({ identifier }) => identifier)
}

export const getProvidersNames = (state: State): PlatformId[] => state.map(({ name }) => name)
export const getProviders = (state: State): ProviderState[] => state

export const getProviderIdByRegion = (state: State, regionId: string | null): PlatformId | null => {
  if (regionId == null) {
    return null
  }

  const platform = state.find(({ regions }) => {
    const region = regions.find(({ identifier }) => identifier === regionId)
    return region !== undefined
  })
  return platform ? platform.name : null
}

export const getRegionName = (state: State, regionId: string): string => {
  const regions = getRegionsByIds(state)

  if (!regions[regionId]) {
    return regionId
  }

  return regions[regionId].name
}

export const getRegionsByIds = (providers: State) => {
  const regionsAcrossProviders = flatMap(providers, (provider) =>
    provider.regions.map(hydrateRegionWithProvider(provider)),
  )
  const regionsById = keyBy(regionsAcrossProviders, `identifier`)

  return regionsById

  function hydrateRegionWithProvider(provider) {
    return (region) => ({ provider: provider.name, ...region })
  }
}

export const getDefaultProvider = (state: State) => find(state, { is_default: true })
