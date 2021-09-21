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

import { compact, flatMap, sumBy, uniq } from 'lodash'

import { getDeploymentResources } from './fundamentals'

import {
  AnyResourceInfo,
  InstanceSummary,
  SliderInstanceType,
  StackDeployment,
} from '../../../types'
import { ClusterInstanceInfo } from '../../api/v1/types'

export function hasHealthyInstances({ resource }: { resource: AnyResourceInfo }): boolean {
  return resource.info.topology.healthy
}

export function hasInstancesUnderMaintenance({ resource }: { resource: AnyResourceInfo }): boolean {
  return resource.info.topology.instances.some((instance) => instance.maintenance_mode)
}

export function countInstances({ resource }: { resource: AnyResourceInfo }) {
  const { instances } = resource.info.topology
  const running = instances.filter((instance) => instance.service_running).length
  const notRunning = instances.filter((instance) => !instance.service_running).length
  const totalReported = running + notRunning

  return {
    running,
    notRunning,
    totalReported,
  }
}

export function getDeploymentAllocatorIds({
  deployment,
}: {
  deployment: StackDeployment
}): string[] {
  const resources = getDeploymentResources({ deployment })

  const allocatorIds = flatMap(resources, (resource) =>
    resource?.info.topology.instances.map((instance) => instance.allocator_id),
  )

  return uniq(compact(allocatorIds))
}

export function getDeploymentMemoryCapacity({
  deployment,
}: {
  deployment: StackDeployment
}): number {
  return sumBy(getDeploymentResources({ deployment }), (resource) =>
    getCurrentMemoryCapacity({ resource }),
  )
}

export function getCurrentMemoryCapacity({ resource }: { resource: AnyResourceInfo }): number {
  const { instances } = resource.info.topology
  return sumBy(instances, (instance) => (instance.memory && instance.memory.instance_capacity) || 0)
}

export function getCurrentStorageCapacity({ resource }: { resource: AnyResourceInfo }): number {
  const { instances } = resource.info.topology
  return sumBy(instances, (instance) => (instance.disk && instance.disk.disk_space_available) || 0)
}

export function getDeploymentTopologyInstances({
  deployment,
  sliderInstanceType,
}: {
  deployment: StackDeployment
  sliderInstanceType?: SliderInstanceType
}): InstanceSummary[] {
  return flatMap(deployment.resources, (resources, kind) => {
    if (sliderInstanceType && sliderInstanceType !== kind) {
      return []
    }

    return flatMap(resources, (resource: AnyResourceInfo) =>
      resource.info.topology.instances.map((instance: ClusterInstanceInfo) => ({
        kind,
        instance,
        resource,
      })),
    )
  })
}

export function getInstanceNames({
  instance,
  resource,
  applyToAll,
}: {
  instance: ClusterInstanceInfo
  resource: AnyResourceInfo
  applyToAll: boolean
}): string[] {
  if (!applyToAll) {
    return [instance.instance_name]
  }

  const instanceConfigurationId = instance.instance_configuration?.id
  const similarInstances = resource.info.topology.instances.filter(sameType)
  const similarInstanceNames = similarInstances.map(({ instance_name }) => instance_name)

  return similarInstanceNames

  function sameType(i: ClusterInstanceInfo) {
    return i.instance_configuration?.id === instanceConfigurationId
  }
}
