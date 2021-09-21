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

import React, { ReactElement } from 'react'
import { max } from 'lodash'

import {
  castSize,
  getInstanceCount,
  getSize,
} from '../../../../../../../lib/deployments/conversion'

import { AnyTopologyElement } from '../../../../../../../types'
import {
  ElasticsearchClusterTopologyElement,
  InstanceConfiguration,
} from '../../../../../../../lib/api/v1/types'

export interface Props {
  topologyElement: AnyTopologyElement
  instanceConfiguration: InstanceConfiguration
  maxNodeCountForEnvironment?: number
  capMaxNodeCount?: boolean
  onChange: (path: string[], value: any) => void
  children: (props: NormalizeSizingProps) => ReactElement
}

export interface NormalizeSizingProps {
  resource: 'storage' | 'memory'
  sizes: number[]
  size: number
  exactSize?: number
  exactInstanceCount?: number
  nodeCount: number
  nodeCountDisabled: boolean
  maxSize: number
  maxNodeCount: number
  storageMultiplier?: number
  cpuMultiplier?: number
  onChangeSize: (value: number) => void
  onChangeNodeCount: (value: number) => void
  onChangeAutoscalingMax: (value: number) => void
  onChangeAutoscalingMin: (value: number) => void
  hasIncompatibleSize: boolean
  instanceConfiguration: InstanceConfiguration
}

// An upper limit if we need to cap the node count,
// but there isn't an entry for the environment.
const MAX_NODE_COUNT = 128

const NormalizeSizing: React.FunctionComponent<Props> = ({
  topologyElement,
  instanceConfiguration,
  maxNodeCountForEnvironment,
  capMaxNodeCount,
  onChange,
  children,
}) => {
  const props = {} as NormalizeSizingProps

  // Sizing can be in aggregate (new style, where node count is derived from
  // memory size being a multiple of the instance configuration's max size) or
  // exact (old style, where memory per node and node count are discrete). This
  // is a layer between node configs and the simple components that don't want
  // to know about any of that.

  // extract all the variables we need
  const {
    discrete_sizes: { resource, sizes },
    storage_multiplier: storageMultiplier,
    // @ts-ignore
    cpu_multiplier: cpuMultiplier,
  } = instanceConfiguration
  const { memory_per_node: exactSize, node_count_per_zone: exactInstanceCount } =
    topologyElement as ElasticsearchClusterTopologyElement // some topology elements are legacy sizing props
  const size = topologyElement.size && topologyElement.size.value

  const usesNewSizing = typeof exactSize !== `number` || typeof exactInstanceCount !== `number`

  const maxSize = Math.max(...sizes)
  const totalSize = getSize({
    resource,
    size: { value: size! },
    exactSize,
    exactInstanceCount,
    instanceConfiguration,
  })
  const nodeCount = getInstanceCount({
    size,
    sizes,
    exactInstanceCount,
  })
  const instanceSize = totalSize
  const nodeCountFallback = capMaxNodeCount ? MAX_NODE_COUNT : Infinity

  props.hasIncompatibleSize = hasIncompatibleSize()
  props.resource = resource
  props.sizes = sizes
  props.size = instanceSize
  props.exactSize = exactSize
  props.exactInstanceCount = exactInstanceCount
  props.nodeCount = nodeCount
  props.nodeCountDisabled = (size! || exactSize!) < maxSize
  props.maxSize = maxSize
  props.maxNodeCount = maxNodeCountForEnvironment || nodeCountFallback
  props.storageMultiplier = storageMultiplier
  props.cpuMultiplier = cpuMultiplier

  props.instanceConfiguration = instanceConfiguration

  props.onChangeSize = changeSize
  props.onChangeNodeCount = changeNodeCount

  props.onChangeAutoscalingMax = (value) => onChange([`autoscaling_max`], { value, resource })
  props.onChangeAutoscalingMin = (value) => onChange([`autoscaling_min`], { value, resource })

  return children(props)

  function hasIncompatibleSize(): boolean {
    if (usesNewSizing) {
      return false
    }

    const memorySizes = sizes.map((value) =>
      castSize({
        size: value,
        from: resource,
        to: `memory`,
        storageMultiplier,
      }),
    )

    const maxMemorySize = max(memorySizes)

    if (exactSize === maxMemorySize) {
      return false
    }

    if (exactInstanceCount === 1 && memorySizes.includes(exactSize!)) {
      return false
    }

    return true
  }

  function changeSize(value: number) {
    // clean up old sizing if present
    if (!usesNewSizing) {
      onChange([`memory_per_node`], undefined)
      onChange([`node_count_per_zone`], undefined)
    }

    onChange([`size`], { value, resource })
  }

  function changeNodeCount(value: number) {
    // clean up old sizing if present
    if (!usesNewSizing) {
      onChange([`memory_per_node`], undefined)
      onChange([`node_count_per_zone`], undefined)
    }

    onChange([`size`], { value: maxSize * value, resource })
  }
}

export default NormalizeSizing
