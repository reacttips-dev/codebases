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

import { keyBy, sumBy, filter, mapValues } from 'lodash'

import { RegionsState, RegionState } from './types'
import { ZooKeeperNodeHealth } from '../../types'
import { PlatformInfo, RegionInfo } from '../../lib/api/v1/types'

export default function createRegionsFromPlatformInfo(platformInfo: PlatformInfo): RegionsState {
  const regionStates = platformInfo.regions.map(createRegionsFromRegionInfo)
  const state = keyBy<RegionState>(regionStates, `id`)

  return state
}

function createRegionsFromRegionInfo(regionInfo: RegionInfo): RegionState {
  const { runners, allocators, proxies, zookeeper_states, coordinators } = regionInfo

  // Instead of using `regionInfo.healthy` we base the health status on specific
  // parts of the region. We do this because clusters and Kibanas are not
  // handled within a region, but on it's own.
  const healthyRegion = runners.healthy && allocators.healthy && proxies.healthy

  const healthyProxiesCount = filter(proxies.proxies, (proxy) => proxy.healthy).length
  const unhealthyProxiesCount = filter(proxies.proxies, (proxy) => !proxy.healthy).length

  return {
    id: regionInfo.region_id,
    healthy: healthyRegion,
    clusters: { healthy: true, count: { total: 0, happy: 0, sad: 0 } },
    kibanas: { healthy: true, count: { total: 0, happy: 0, sad: 0 } },
    runners: {
      healthy: runners.healthy,
      count: {
        total: runners.total_runners,
        happy: runners.connected_runners,
        sad: runners.total_runners - runners.connected_runners,
      },
    },
    allocators: {
      healthy: allocators.healthy,
      count: {
        total: sumBy(regionInfo.allocators.zone_summaries, (zone) => zone.connected_allocators),
      },
      zones: {
        count: {
          total: filter(
            regionInfo.allocators.zone_summaries,
            (zone) => zone.connected_allocators > 0,
          ).length,
        },
      },
    },
    proxies: {
      healthy: proxies.healthy,
      count: {
        total: proxies.proxies_count,
        happy: healthyProxiesCount,
        sad: unhealthyProxiesCount,
      },
    },
    coordinators: {
      coordinators: keyBy(coordinators.coordinators, 'name'),
    },
    zookeeper: {
      healthy: zookeeper_states.states.every(
        (state) => state.state === `connected` || state.state === `reconnected`,
      ),
      zookeeper: mapValues(
        keyBy(zookeeper_states.states, 'id'),
        (state) => state.state.toUpperCase() as ZooKeeperNodeHealth,
      ),
    },
    hrefs: {},
  }
}
