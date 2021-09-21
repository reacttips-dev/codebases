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

import { cloneDeep, find, get, set } from 'lodash'

import { SetDiskQuotaAction } from './clusterTypes'
import { ElasticsearchCluster, ElasticsearchClusterInstance } from '../../types'

export default function setDiskQuota(cluster: ElasticsearchCluster, action: SetDiskQuotaAction) {
  const nextCluster = cloneDeep(cluster)

  const { instanceIds, previousDiskQuota, defaultDiskQuota } = action.meta

  const currentDiskQuota = action.payload.storage_multiplier

  // We expect the find the instance by its ID
  const instances = instanceIds.map((id) =>
    find(nextCluster.instances.record, { name: id }),
  ) as ElasticsearchClusterInstance[]

  instances.forEach((instance) => {
    const previousCapacity = get(instance, [`capacity`, `storage`]) || 0
    const storagePerUnit = previousCapacity / previousDiskQuota

    const quota = currentDiskQuota === null ? defaultDiskQuota : currentDiskQuota

    set(instance, [`capacity`, `storage`], quota * storagePerUnit)
  })

  return nextCluster
}
