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
import { ProxyAllocationInfo, ProxyInfo, ProxyOverview } from '../../lib/api/v1/types'
import { RegionProxies, RegionProxy } from '../../types'

const getAllocationCount = (
  allocations: ProxyAllocationInfo[],
  type: 'elasticsearch' | 'kibana' | 'apm' | 'enterprise_search',
) =>
  get(
    allocations.find(({ allocations_type }) => allocations_type === type),
    [`counts`, `allocations`],
    0,
  )

const createProxy = (proxy: ProxyInfo): RegionProxy => {
  const { proxy_id, allocations, healthy, public_hostname, zone, runner_id } = proxy

  const elasticsearchAllocations = getAllocationCount(allocations, `elasticsearch`)
  const kibanaAllocations = getAllocationCount(allocations, `kibana`)
  const apmAllocations = getAllocationCount(allocations, `apm`)
  const enterpriseSearchAllocations = getAllocationCount(allocations, `enterprise_search`)

  const totalAllocations =
    elasticsearchAllocations + kibanaAllocations + apmAllocations + enterpriseSearchAllocations

  return {
    id: proxy_id,
    runnerId: runner_id || null,
    healthy,
    availabilityZone: zone || ``,
    publicHostname: public_hostname,
    allocationCounts: {
      elasticsearch: elasticsearchAllocations,
      kibana: kibanaAllocations,
      apm: apmAllocations,
      enterpriseSearch: enterpriseSearchAllocations,
      total: totalAllocations,
    },
    type: `proxy`,
    proxyInfo: proxy,
  }
}

export default function createProxies(source: ProxyOverview): RegionProxies {
  const {
    proxies,
    proxies_count,
    settings: { expected_proxies_count },
  } = source

  return {
    healthy: proxies.every((proxy) => proxy.healthy),
    count: {
      total: proxies_count,
      expected: expected_proxies_count,
    },
    proxies: proxies.map(createProxy),
  }
}
