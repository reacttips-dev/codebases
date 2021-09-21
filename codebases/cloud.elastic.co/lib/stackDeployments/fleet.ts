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

import { satisfies } from '../semver'

import {
  getFirstSliderClusterFromGet,
  getSliderPlanFromGet,
  isSizedSliderResource,
} from './selectors/fundamentals'

import { getInstanceConfigurationById } from '../instanceConfigurations/instanceConfiguration'
import { getInstanceCount, getSize } from '../deployments/conversion'

import { StackDeployment, VersionNumber } from '../../types'
import { DeploymentTemplateInfoV2 } from '../api/v1/types'

const FLEET_SERVER_VERSION_RANGE = `>=7.13.0`
const FLEET_WARNING_THRESHOLD = 600 // MB

export function isFleetServerAvailable({
  version,
}: {
  version: VersionNumber | null | undefined
}): boolean {
  return Boolean(version && satisfies(version, FLEET_SERVER_VERSION_RANGE))
}

export function willFleetBeAddedOnUpgrade({
  deployment,
  fromVersion,
  toVersion,
}: {
  deployment: StackDeployment
  fromVersion: VersionNumber
  toVersion: VersionNumber
}): boolean {
  if (isFleetServerAvailable({ version: fromVersion })) {
    return false // already have it
  }

  if (!isFleetServerAvailable({ version: toVersion })) {
    return false // not gonna get it
  }

  const apmResource = getFirstSliderClusterFromGet({ deployment, sliderInstanceType: `apm` })

  return Boolean(apmResource && isSizedSliderResource({ resource: apmResource }))
}

export function hasSmallApm({
  deployment,
  deploymentTemplate,
}: {
  deployment: StackDeployment
  deploymentTemplate: DeploymentTemplateInfoV2
}): boolean {
  const memorySize = getNodeMemorySize()

  if (memorySize === 0) {
    return false // can't easily calculate the memory size for whatever reason
  }

  if (memorySize > FLEET_WARNING_THRESHOLD) {
    return false // not small enough to be a concern
  }

  return true

  /*
   * Return per-node memory size since it's a flat memory overhead per node that
   * we're concerned with.
   */
  function getNodeMemorySize() {
    const plan = getSliderPlanFromGet({ deployment, sliderInstanceType: `apm` })
    const topologyElement = plan?.cluster_topology?.[0]

    if (!topologyElement) {
      return 0
    }

    const size = topologyElement.size?.value

    if (!size) {
      return 0
    }

    if (!topologyElement.instance_configuration_id) {
      return 0
    }

    const instanceConfiguration = getInstanceConfigurationById(
      deploymentTemplate.instance_configurations,
      topologyElement.instance_configuration_id,
    )

    if (!instanceConfiguration) {
      return 0
    }

    const instanceCount = getInstanceCount({
      size,
      sizes: instanceConfiguration.discrete_sizes.sizes,
    })

    if (!instanceCount) {
      return 0
    }

    const memoryAmount = getSize({
      resource: `memory`,
      size: {
        value: size,
      },
      instanceConfiguration,
    })

    return memoryAmount / instanceCount
  }
}

export function showFleetWarningOnUpgrade({
  deployment,
  deploymentTemplate,
  fromVersion,
  toVersion,
}: {
  deployment: StackDeployment
  deploymentTemplate: DeploymentTemplateInfoV2
  fromVersion: VersionNumber | null
  toVersion: VersionNumber | null
}): boolean {
  if (!fromVersion || !toVersion) {
    return false
  }

  return (
    willFleetBeAddedOnUpgrade({ deployment, fromVersion, toVersion }) &&
    hasSmallApm({ deployment, deploymentTemplate })
  )
}
