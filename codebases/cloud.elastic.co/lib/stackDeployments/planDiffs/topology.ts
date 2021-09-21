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
import { differenceBy, flatMap, isEqual, sortBy } from 'lodash'
import {
  ElasticsearchClusterPlan,
  ElasticsearchClusterTopologyElement,
  InstanceConfiguration,
} from '../../api/v1/types'
import { AnyPlan, AnyTopologyElement } from '../../../types'
import { hasNext } from './preconditions'
import { Difference, DifferenceArgs, DifferenceCheck } from './types'
import { getInstanceCount, getSize } from '../../deployments/conversion'

export const diffTopology: DifferenceCheck = {
  preconditions: [hasNext],
  check: (args) => {
    const { next, current } = args

    if (!next!.cluster_topology) {
      return []
    }

    const nextTopology = sortBy(
      next!.cluster_topology,
      `instance_configuration_id`,
    ) as AnyTopologyElement[]
    const currentTopology = sortBy(
      current?.cluster_topology || ([] as AnyTopologyElement[]),
      `instance_configuration_id`,
    )
    const currentTopologyById = new Map(
      currentTopology.map(
        (topologyElement: AnyTopologyElement) =>
          [topologyElement.id, topologyElement] as [string, AnyTopologyElement],
      ),
    )
    const currentTopologyByInstanceConfiguration = new Map(
      currentTopology.map(
        (topologyElement: AnyTopologyElement) =>
          [topologyElement.instance_configuration_id, topologyElement] as [
            string,
            AnyTopologyElement,
          ],
      ),
    )
    const missingTopologyElements = differenceBy(
      currentTopology,
      nextTopology,
      `instance_configuration_id`,
    )

    return [
      ...diffTopologyElements({
        nextTopology,
        args,
        currentTopology: {
          asArray: currentTopology,
          byId: currentTopologyById,
          byInstanceConfiguration: currentTopologyByInstanceConfiguration,
        },
      }),
      ...diffRemovedTopologyElements({
        missingTopologyElements,
        args,
      }),
    ]
  },
}

interface DisabledNodeMeta {
  instanceConfiguration: InstanceConfiguration | null
  topologyElement: AnyTopologyElement
}

function diffRemovedTopologyElements({
  missingTopologyElements,
  args: { instanceConfigurations, sliderInstanceType, current },
}: {
  missingTopologyElements: AnyTopologyElement[]
  args: DifferenceArgs
}): Array<Difference<DisabledNodeMeta>> {
  const allChanges = missingTopologyElements.map(
    (missingTopologyElement): Difference<DisabledNodeMeta> | null => {
      const instanceConfiguration = getInstanceConfiguration(
        missingTopologyElement,
        instanceConfigurations,
      )
      const { size, zoneCount, instanceCount } = getTopologySizes(
        missingTopologyElement,
        instanceConfiguration!,
        current,
      )
      const wasSized = size > 0 && instanceCount > 0 && zoneCount > 0

      if (wasSized) {
        return {
          type: `topology-element-disabled`,
          target: sliderInstanceType,
          meta: {
            instanceConfiguration,
            topologyElement: missingTopologyElement,
          },
        }
      }

      return null
    },
  )

  return allChanges.filter((diff): diff is Difference<DisabledNodeMeta> => diff !== null)
}

function diffTopologyElements({
  nextTopology,
  currentTopology,
  args: { instanceConfigurations, sliderInstanceType, current, next },
}: {
  nextTopology: AnyTopologyElement[]
  currentTopology: {
    asArray: AnyTopologyElement[]
    byId: Map<string, AnyTopologyElement>
    byInstanceConfiguration: Map<string, AnyTopologyElement>
  }
  args: DifferenceArgs
}): Array<Difference<any>> {
  const allChanges = nextTopology.map((nextTopologyElement, index) => {
    let currentTopologyElement: AnyTopologyElement | undefined

    if (nextTopologyElement.id) {
      currentTopologyElement = currentTopology.byId.get(nextTopologyElement.id)
    }

    if (!currentTopologyElement && nextTopologyElement.instance_configuration_id) {
      currentTopologyElement = currentTopology.byInstanceConfiguration.get(
        nextTopologyElement.instance_configuration_id,
      )
    }

    if (!currentTopologyElement) {
      currentTopologyElement = currentTopology.asArray[index]
    }

    const instanceConfiguration =
      getInstanceConfiguration(nextTopologyElement, instanceConfigurations) ||
      getInstanceConfiguration(currentTopologyElement, instanceConfigurations)
    const currentSize = getTopologySizes(currentTopologyElement, instanceConfiguration!, current)
    const nextSize = getTopologySizes(nextTopologyElement, instanceConfiguration!, next)

    // handle 0 sized instance configs in the new plan that didn't exist at all in the old plan
    // e.g. ML doesn't exist even as a 0 sized instance in 5.x plans. When you upgrade to 6.x, a 0 sized ML gets added
    if (!currentTopologyElement && nextSize.size === 0) {
      return []
    }

    const hasSizeChanged = currentSize.absoluteSize !== nextSize.absoluteSize
    const hasInstanceCountChanged = currentSize.instanceCount !== nextSize.instanceCount
    const hasZoneCountChanged = currentSize.zoneCount !== nextSize.zoneCount

    const hasTopologyChanged = hasSizeChanged || hasInstanceCountChanged || hasZoneCountChanged
    const isZeroSized =
      nextSize.zoneCount === 0 || nextSize.size === 0 || nextSize.instanceCount === 0
    const hasBeenDisabled = hasTopologyChanged && isZeroSized

    if (hasBeenDisabled) {
      return {
        type: `topology-element-disabled`,
        target: sliderInstanceType,
        meta: {
          instanceConfiguration,
          topologyElement: nextTopologyElement,
        },
      }
    }

    const diffs: Array<Difference<any>> = []

    if (hasSizeChanged) {
      diffs.push({
        type: `topology-size-changed`,
        target: sliderInstanceType,
        meta: {
          instanceConfiguration,
          resource: instanceConfiguration?.discrete_sizes.resource || `memory`,
          currentSize: currentSize.absoluteSize,
          nextSize: nextSize.absoluteSize,
          topologyElement: nextTopologyElement,
        },
      })
    }

    if (hasInstanceCountChanged) {
      diffs.push({
        type: `topology-instance-count-changed`,
        target: sliderInstanceType,
        meta: {
          instanceConfiguration,
          currentCount: currentSize.instanceCount,
          nextCount: nextSize.instanceCount,
          topologyElement: nextTopologyElement,
        },
      })
    }

    if (hasZoneCountChanged) {
      diffs.push({
        type: `topology-zone-count-changed`,
        target: sliderInstanceType,
        meta: {
          instanceConfiguration,
          currentCount: currentSize.zoneCount,
          nextCount: nextSize.zoneCount,
          topologyElement: nextTopologyElement,
        },
      })
    }

    if (!isZeroSized) {
      const isAutoscalingEnabled = (next as ElasticsearchClusterPlan).autoscaling_enabled
      const currentEsTopology = currentTopologyElement as
        | ElasticsearchClusterTopologyElement
        | undefined
      const nextEsTopology = nextTopologyElement as ElasticsearchClusterTopologyElement

      if (
        isAutoscalingEnabled &&
        !(
          isEqual(currentEsTopology?.autoscaling_max, nextEsTopology.autoscaling_max) &&
          isEqual(currentEsTopology?.autoscaling_min, nextEsTopology.autoscaling_min)
        )
      ) {
        diffs.push({
          type: `topology-autoscaling-limits-changed`,
          target: sliderInstanceType,
          meta: {
            instanceConfiguration,
            currentTopologyElement,
            nextTopologyElement,
          },
        })
      }
    }

    return diffs
  })

  return flatMap(allChanges)
}

function getTopologySizes(
  topologyElement: AnyTopologyElement | undefined,
  instanceConfiguration: InstanceConfiguration,
  plan: AnyPlan | null | undefined,
) {
  const resource = instanceConfiguration?.discrete_sizes.resource || `memory`
  const sizes = instanceConfiguration?.discrete_sizes.sizes || []
  const currentFlexSize = topologyElement?.size
  const currentExactCount =
    (topologyElement as ElasticsearchClusterTopologyElement)?.node_count_per_zone || 0
  const currentCapacity =
    (topologyElement as ElasticsearchClusterTopologyElement)?.memory_per_node || 0
  const globalZoneCount = (plan as ElasticsearchClusterPlan)?.zone_count || 0
  const zoneCount = topologyElement?.zone_count || globalZoneCount

  const size = getSize({
    resource,
    size: currentFlexSize,
    exactSize: currentCapacity,
    exactInstanceCount: currentExactCount,
    instanceConfiguration,
  })
  const instanceCount = getInstanceCount({
    size: currentFlexSize?.value,
    sizes,
    exactInstanceCount: currentExactCount,
  })

  return {
    size,
    instanceCount,
    zoneCount,
    absoluteSize: instanceCount === 0 ? 0 : size / instanceCount,
  }
}

export function getInstanceConfiguration(
  topologyElement: AnyTopologyElement | undefined,
  instanceConfigurations: InstanceConfiguration[],
): InstanceConfiguration | null {
  if (!topologyElement) {
    return null
  }

  const { instance_configuration_id } = topologyElement

  const instanceConfiguration = instanceConfigurations.find(
    (configuration) => configuration.id === instance_configuration_id,
  )

  return instanceConfiguration || null
}
