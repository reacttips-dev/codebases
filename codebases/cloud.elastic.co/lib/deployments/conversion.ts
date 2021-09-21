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

import { get, some, sumBy } from 'lodash'

import { AnyPlan, AnyTopologyElement } from '../../types'

import {
  ElasticsearchClusterPlan,
  ElasticsearchClusterTopologyElement,
  InstanceConfiguration,
} from '../api/v1/types'

type SizeSettingsSignature = {
  resource: 'memory' | 'storage'
  size?: {
    value: number
  }
  exactSize?: number
  exactInstanceCount?: number
  instanceConfiguration: InstanceConfiguration
}

type SizeCastSignature = {
  size: number
  from: 'memory' | 'storage'
  to: 'memory' | 'storage'
  storageMultiplier?: number
}

export function getSize(settings: SizeSettingsSignature): number {
  const { resource, size, exactSize, exactInstanceCount, instanceConfiguration } = settings

  const storageMultiplier = instanceConfiguration
    ? instanceConfiguration.storage_multiplier
    : undefined

  if (resource === `storage`) {
    const memorySize = getSize({
      ...settings,
      resource: `memory`,
    })

    if (!instanceConfiguration) {
      return 0
    }

    return castSize({
      size: memorySize,
      from: `memory`,
      to: resource,
      storageMultiplier,
    })
  }

  if (!size) {
    if (typeof exactSize === `number` && typeof exactInstanceCount === `number`) {
      const memorySize = exactSize * exactInstanceCount
      return memorySize
    }
  }

  if (!instanceConfiguration) {
    return 0
  }

  const {
    discrete_sizes: { resource: configurationResource, default_size },
  } = instanceConfiguration

  const sizeValue = typeof size?.value === 'number' ? size.value : default_size

  return castSize({
    size: sizeValue,
    from: configurationResource,
    to: resource,
    storageMultiplier,
  })
}

export function getInstanceCount({
  size,
  sizes,
  exactInstanceCount,
}: {
  size?: number
  sizes: number[]
  exactInstanceCount?: number
}): number {
  if (typeof size !== `number` && typeof exactInstanceCount !== `number`) {
    throw new Error(`Invalid arguments supplied to getInstanceCount`)
  }

  if (typeof size !== `number`) {
    return exactInstanceCount!
  }

  const maxSize = Math.max(...sizes)
  const instanceCount = Math.ceil(size / maxSize)
  return instanceCount
}

export function getInstanceSize({
  size,
  sizes,
  exactSize,
}: {
  size?: number
  sizes: number[]
  exactSize?: number
}): number | undefined {
  if (typeof size !== `number` && typeof exactSize !== `number`) {
    throw new Error(`Invalid arguments supplied to getInstanceSize()`)
  }

  if (typeof size !== `number`) {
    return exactSize
  }

  const maxSize = Math.max(...sizes)
  return Math.min(size, maxSize)
}

export function castSize({ size, from, to, storageMultiplier }: SizeCastSignature): number {
  if (from === to) {
    return size
  }

  if (typeof storageMultiplier !== `number`) {
    throw new Error(`Invalid arguments provided to castSize()`)
  }

  if (from === `storage`) {
    return size / storageMultiplier
  }

  if (from === `memory`) {
    return size * storageMultiplier
  }

  throw new Error(`Invalid arguments provided to castSize()`)
}

export function getDeploymentSize({
  nodeConfigurations,
  instanceConfigurations = [],
}: {
  nodeConfigurations: AnyTopologyElement[]
  instanceConfigurations: InstanceConfiguration[]
}): number {
  return sumBy(nodeConfigurations.filter(isEnabledConfiguration), (nodeConfiguration) => {
    const { instance_configuration_id } = nodeConfiguration

    const instanceConfiguration = instanceConfigurations.find(
      (eachConfig) => eachConfig.id === instance_configuration_id,
    )

    if (instanceConfiguration === undefined) {
      return 0
    }

    if (
      // @ts-ignore
      typeof nodeConfiguration.node_count_per_zone === `number` &&
      // @ts-ignore
      typeof nodeConfiguration.memory_per_node === `number`
    ) {
      const esNodeConfig = nodeConfiguration as ElasticsearchClusterTopologyElement
      return getSize({
        resource: `memory`,
        exactSize: esNodeConfig.memory_per_node!,
        exactInstanceCount: esNodeConfig.node_count_per_zone!,
        instanceConfiguration,
      })
    }

    return getSize({
      resource: `memory`,
      size: nodeConfiguration.size,
      instanceConfiguration,
    })
  })
}

export function getDeploymentInstanceCount({
  plan,
  instanceConfigurations = [],
}: {
  plan: ElasticsearchClusterPlan
  instanceConfigurations: InstanceConfiguration[]
}) {
  const { cluster_topology } = plan

  return sumBy(cluster_topology, (nodeConfiguration) => {
    const { instance_configuration_id, size } = nodeConfiguration

    // AppSearch doesn't have this field so we cast just for pulling it out without TS complaining about it
    const exactInstanceCount = (nodeConfiguration as any).node_count_per_zone

    if (size == null && exactInstanceCount == null) {
      return 0
    }

    const instanceConfiguration = instanceConfigurations.find(
      (eachConfig) => eachConfig.id === instance_configuration_id,
    )

    if (instanceConfiguration === undefined) {
      return 0
    }

    const sizes = get(instanceConfiguration, [`discrete_sizes`, `sizes`])

    return getInstanceCount({
      size: size && size.value,
      sizes,
      exactInstanceCount,
    })
  })
}

export function isEmptyDeployment(plan: AnyPlan) {
  if (!plan || !plan.cluster_topology) {
    return true
  }

  const hasAnyMeaningfulConfigurations = some(plan.cluster_topology, isEnabledConfiguration)
  return !hasAnyMeaningfulConfigurations
}

export function isEnabledConfiguration({
  size,

  // @ts-ignore - APM topology never has exact sizing properties, but the topology types
  // have no key property to discriminate them
  memory_per_node,

  // @ts-ignore
  node_count_per_zone,

  // @ts-ignore
  autoscaling_min,
}: AnyTopologyElement): boolean {
  return (
    (typeof size === `object` &&
      size !== null &&
      typeof size.value === `number` &&
      size.value > 0) ||
    (typeof memory_per_node === `number` &&
      memory_per_node > 0 &&
      typeof node_count_per_zone === `number` &&
      node_count_per_zone > 0) ||
    (typeof autoscaling_min === `object` &&
      autoscaling_min !== null &&
      typeof autoscaling_min.value === `number` &&
      autoscaling_min.value > 0)
  )
}
