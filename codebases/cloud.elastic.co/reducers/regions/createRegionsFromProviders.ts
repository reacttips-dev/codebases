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

import { flatMap, keyBy } from 'lodash'

import { RegionsState, RegionState } from './types'
import { Provider, Region } from '../../lib/api/v1/types'

export default function createRegionsFromProviders(providers: Provider[]): RegionsState {
  const regions = flatMap(providers, (provider) => provider.regions)
  const regionStates = regions.map(createRegionStateFromProvider)
  const state = keyBy<RegionState>(regionStates, `id`)

  return state
}

function createRegionStateFromProvider(region: Region): RegionState {
  const allocatorsCount = {
    total: getAllocatorCount(region),
  }

  return {
    id: region.identifier,
    healthy: true,
    clusters: { healthy: true, count: { total: 0, happy: 0, sad: 0 } },
    kibanas: { healthy: true, count: { total: 0, happy: 0, sad: 0 } },
    runners: { healthy: true, count: { total: 0 } },
    allocators: {
      healthy: true,
      count: allocatorsCount,
      zones: {
        count: allocatorsCount,
      },
    },
    proxies: { healthy: true, count: { total: 0 } },
    coordinators: { coordinators: {} },
    zookeeper: { healthy: true, zookeeper: {} },
    hrefs: {},
  }
}

function getAllocatorCount(region: Region): number {
  if (region.features.includes(`ha-3`)) {
    return 3
  }

  if (region.features.includes(`ha`)) {
    return 2
  }

  return 1
}
