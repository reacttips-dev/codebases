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

import {
  ElasticsearchCluster,
  ElasticsearchClusterInstance,
  SetInstanceCapacityAction,
} from '../../types'

export default function setInstanceCapacity(
  cluster: ElasticsearchCluster,
  action: SetInstanceCapacityAction,
) {
  const nextCluster = cloneDeep(cluster)

  const { instanceIds, instanceCapacity } = action.meta

  const memoryPath = [`capacity`, `memory`]
  const storagePath = [`capacity`, `storage`]

  // We expect the find the instance by its ID
  const instances = instanceIds.map((id) =>
    find(nextCluster.instances.record, {
      name: id,
    }),
  ) as ElasticsearchClusterInstance[]

  instances.forEach((instance) => {
    const currentMemoryCapacity = get(instance, memoryPath)
    const currentStorageCapacity = get(instance, storagePath)
    const storageCapacity = (instanceCapacity * currentStorageCapacity) / currentMemoryCapacity

    set(instance, memoryPath, instanceCapacity)
    set(instance, storagePath, storageCapacity)
  })

  return nextCluster
}
