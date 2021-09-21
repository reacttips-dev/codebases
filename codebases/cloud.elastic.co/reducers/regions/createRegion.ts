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

import { filter, sumBy, keyBy, map } from 'lodash'

import { Region, Coordinator } from '../../types'

const createHrefs = (selfUrl, hrefs) => {
  const versions = `${selfUrl}/versions/elastic`
  const coordinatorCandidates = `${selfUrl}/coordinators/candidates`
  const coordinatorInstances = `${selfUrl}/coordinators/instances`

  return {
    ...hrefs,
    settings: `${selfUrl}/config`,
    // eslint-disable-next-line react-hooks/rules-of-hooks
    'create-cluster': useNewApi(hrefs.clusters),
    'blueprint-roles': `${selfUrl}/blueprint/roles`,
    cluster: `${selfUrl}/clusters/{clusterId}`,
    kibana: `${hrefs[`kibana-clusters`]}/{kibanaId}`,
    runner: `${selfUrl}/runners/{runnerId}`,
    allocator: `${selfUrl}/allocators/{availabilityZone}/{ip}`,
    versions,
    'elastic-stack-version': `${versions}/{version}`,
    'coordinator-candidates': coordinatorCandidates,
    'promote-candidate': `${coordinatorCandidates}/{ip}/_promote`,
    'delete-candidate': `${coordinatorCandidates}/{ip}`,
    'demote-coordinator': `${coordinatorInstances}/{ip}/_demote`,
    license: `${selfUrl}/licensing/enterprise_license`,
    'set-license': `${selfUrl}/licensing/enterprise_license`,
    'remove-license': `${selfUrl}/licensing/enterprise_license`,
    'node-configurations': `${selfUrl}/node_types/elasticsearch`,
    'node-configuration': `${selfUrl}/node_types/elasticsearch/{nodeConfigurationId}`,
  }

  function useNewApi(url) {
    return url.replace(/v0\.1\/regions/, `v1/regions`) + `/elasticsearch`
  }
}

const createCoordinator = (coordinator): Coordinator => ({
  ...coordinator,
  type: `coordinator`,
  publicHostname: coordinator.public_hostname,
})

export default function createRegion(id, source, selfUrl): Region {
  const {
    clusters,
    kibana_clusters: kibanas,
    allocators,
    proxies,
    runners,
    coordinators,
    zookeeper,
    hrefs,
  } = source

  const zonesWithAllocators = filter(allocators.zones, (zone) => zone.connected_allocators > 0)

  const allocatorCount = sumBy(zonesWithAllocators, (zone) => zone.connected_allocators)

  const healthyProxiesCount = filter(proxies.proxies, (proxy) => proxy.healthy).length
  const unhealthyProxiesCount = filter(proxies.proxies, (proxy) => !proxy.healthy).length

  // Instead of using `source.healthy` we base the health status on specific
  // parts of the region. We do this because clusters and Kibanas are not
  // handled within a region, but on it's own.
  const isRegionHealthy = runners.healthy && allocators.healthy && proxies.healthy

  return {
    id,
    healthy: isRegionHealthy,
    clusters: {
      healthy: clusters.healthy,
      count: {
        total: clusters.happy_count + clusters.sad_count,
        happy: clusters.happy_count,
        sad: clusters.sad_count,
      },
    },
    kibanas: {
      healthy: kibanas.healthy,
      count: {
        total: kibanas.happy_count + kibanas.sad_count,
        happy: kibanas.happy_count,
        sad: kibanas.sad_count,
      },
    },
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
      zones: {
        count: {
          total: zonesWithAllocators.length,
        },
      },
      count: {
        total: allocatorCount,
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
      coordinators: keyBy(map(coordinators.coordinators, createCoordinator), `id`),
    },
    zookeeper,
    hrefs: createHrefs(selfUrl, hrefs),
  }
}
