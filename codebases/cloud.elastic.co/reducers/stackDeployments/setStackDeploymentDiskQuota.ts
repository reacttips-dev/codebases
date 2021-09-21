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

import { getResourceById } from '../../lib/stackDeployments'

import { SetInstanceDiskQuotaAction, StackDeployment } from '../../types'

export default function setStackDeploymentDiskQuota(
  deployment: StackDeployment,
  action: SetInstanceDiskQuotaAction,
) {
  const nextDeployment = cloneDeep(deployment)
  const { clusterId, instanceIds, previousDiskQuota, defaultDiskQuota } = action.meta
  const currentDiskQuota = action.payload.storage_multiplier

  const storagePath = [`disk`, `disk_space_available`]

  const resource = getResourceById({
    deployment: nextDeployment,
    resourceType: `elasticsearch`,
    resourceId: clusterId,
  })
  const { instances } = resource!.info.topology

  // We expect to find the instance by its ID
  const resourceInstances = instanceIds.map((id) => find(instances, { instance_name: id }))

  resourceInstances.forEach((instance) => {
    const previousCapacity = get(instance, storagePath, 0)
    const storagePerUnit = previousCapacity / previousDiskQuota

    const quota = currentDiskQuota === null ? defaultDiskQuota : currentDiskQuota

    set(instance!, storagePath, quota * storagePerUnit)
  })

  return nextDeployment
}
