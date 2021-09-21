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

import React from 'react'

import { DifferenceFormatter } from '../types'
import {
  ElasticsearchClusterTopologyElement,
  InstanceConfiguration,
} from '../../../../lib/api/v1/types'
import { AnyTopologyElement } from '../../../../types'
import { Difference } from '../../../../lib/stackDeployments/planDiffs/types'
import InstanceConfigurationDisabled from '../ExplainChanges/InstanceConfigurationDisabled'
import AutoscalingTopologyChange from '../ExplainChanges/AutoscalingTopologyChange'
import ZoneCountChange from '../ExplainChanges/ZoneCountChange'
import InstanceSizeChange from '../ExplainChanges/InstanceSizeChange'
import InstanceCountChange from '../ExplainChanges/InstanceCountChange'

export const disabledTopologyElementFormatter: DifferenceFormatter = {
  handles: `topology-element-disabled`,
  formatter: ({ difference }) => {
    const { target, meta } = difference as Difference<{
      instanceConfiguration: InstanceConfiguration
      topologyElement: AnyTopologyElement
    }>

    const { instanceConfiguration, topologyElement } = meta!

    return {
      id: `${target}-${getInstanceConfigurationIdForId({ instanceConfiguration })}-disabled`,
      type: target,
      message: (
        <InstanceConfigurationDisabled
          instanceConfiguration={instanceConfiguration}
          topologyElement={topologyElement}
        />
      ),
    }
  },
}

export const autoscalingLimitsChangedFormatter: DifferenceFormatter = {
  handles: `topology-autoscaling-limits-changed`,
  formatter: ({ difference }) => {
    const { target, meta } = difference as Difference<{
      instanceConfiguration: InstanceConfiguration
      currentTopologyElement: ElasticsearchClusterTopologyElement
      nextTopologyElement: ElasticsearchClusterTopologyElement
    }>

    const { instanceConfiguration, currentTopologyElement, nextTopologyElement } = meta!

    return {
      id: `${target}-${getInstanceConfigurationIdForId({ instanceConfiguration })}-autoscaling`,
      type: target,
      message: (
        <AutoscalingTopologyChange
          oldNodeConfiguration={currentTopologyElement}
          newNodeConfiguration={nextTopologyElement}
          instanceConfiguration={instanceConfiguration}
        />
      ),
    }
  },
}

export const zoneCountChangedFormatter: DifferenceFormatter = {
  handles: `topology-zone-count-changed`,
  formatter: ({ difference }) => {
    const { target, meta } = difference as Difference<{
      instanceConfiguration: InstanceConfiguration
      currentCount: number
      nextCount: number
      topologyElement: AnyTopologyElement
    }>

    const { instanceConfiguration, currentCount, nextCount, topologyElement } = meta!

    return {
      id: `${target}-${getInstanceConfigurationIdForId({ instanceConfiguration })}-zone-count`,
      type: target,
      testParams: [currentCount, nextCount],
      message: (
        <ZoneCountChange
          oldCount={currentCount}
          currentCount={nextCount}
          topologyElement={topologyElement}
          instanceConfiguration={instanceConfiguration}
        />
      ),
    }
  },
}

export const instanceCountChangedFormatter: DifferenceFormatter = {
  handles: `topology-instance-count-changed`,
  formatter: ({ difference }) => {
    const { target, meta } = difference as Difference<{
      instanceConfiguration: InstanceConfiguration
      currentCount: number
      nextCount: number
      topologyElement: AnyTopologyElement
    }>

    const { instanceConfiguration, currentCount, nextCount, topologyElement } = meta!

    return {
      id: `${target}-${getInstanceConfigurationIdForId({ instanceConfiguration })}-node-count`,
      type: target,
      testParams: [currentCount, nextCount],
      message: (
        <InstanceCountChange
          oldCount={currentCount}
          currentCount={nextCount}
          topologyElement={topologyElement}
          instanceConfiguration={instanceConfiguration}
        />
      ),
    }
  },
}

export const instanceSizeChangedFormatter: DifferenceFormatter = {
  handles: `topology-size-changed`,
  formatter: ({ difference }) => {
    const { target, meta } = difference as Difference<{
      instanceConfiguration: InstanceConfiguration
      resource: 'memory' | 'storage'
      currentSize: number
      nextSize: number
      topologyElement: AnyTopologyElement
    }>

    const { instanceConfiguration, resource, currentSize, nextSize, topologyElement } = meta!

    return {
      id: `${target}-${getInstanceConfigurationIdForId({ instanceConfiguration })}-node-size`,
      type: target,
      testParams: [currentSize, nextSize],
      message: (
        <InstanceSizeChange
          resource={resource}
          oldSize={currentSize}
          currentSize={nextSize}
          topologyElement={topologyElement}
          instanceConfiguration={instanceConfiguration}
        />
      ),
    }
  },
}

function getInstanceConfigurationIdForId({
  instanceConfiguration,
}: {
  instanceConfiguration?: InstanceConfiguration
} = {}): string {
  return instanceConfiguration?.id || `_unknown_`
}
