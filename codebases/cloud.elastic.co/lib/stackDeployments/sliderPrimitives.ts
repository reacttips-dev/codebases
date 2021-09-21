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

import { doesTopologyIncludeNodeType, getProductSliderTypes } from '../sliders'
import { isEnabledConfiguration } from '../deployments/conversion'

import {
  AnyClusterInfo,
  AnyTopologyElement,
  SliderType,
  SliderNodeType,
  SliderInstanceType,
} from '../../types'

import { DeploymentResources } from '../api/v1/types'

export function isSliderEnabled({
  deployment: { resources },
  sliderInstanceType,
  sliderNodeType,
}: {
  deployment: {
    resources: DeploymentResources
  }
  sliderInstanceType: SliderInstanceType
  sliderNodeType?: SliderNodeType
}): boolean {
  if (!Array.isArray(resources[sliderInstanceType])) {
    return false
  }

  const sliderClusters = resources[sliderInstanceType]

  return sliderClusters.some(doesClusterContainMatchingNodeConfiguration)

  function doesClusterContainMatchingNodeConfiguration(cluster: { info: AnyClusterInfo }): boolean {
    if (!cluster.info || !cluster.info.plan_info.current || !cluster.info.plan_info.current.plan) {
      return false
    }

    const nodeConfigurations: AnyTopologyElement[] | undefined =
      cluster.info.plan_info.current.plan.cluster_topology

    if (!Array.isArray(nodeConfigurations)) {
      return false
    }

    return nodeConfigurations.some(doesNodeConfigurationMatchSliderType)
  }

  function doesNodeConfigurationMatchSliderType(nodeConfiguration: AnyTopologyElement): boolean {
    const enabled = isEnabledConfiguration(nodeConfiguration)

    if (!enabled) {
      return false
    }

    if (!sliderNodeType) {
      return true
    }

    return doesTopologyIncludeNodeType({
      nodeConfigurations: [nodeConfiguration],
      sliderInstanceType,
      sliderNodeType,
    })
  }
}

export function getDeploymentProductSliderTypes({
  deployment,
}: {
  deployment: {
    resources: DeploymentResources
  }
}): SliderType[] {
  const enabledTypes = getProductSliderTypes().filter(({ sliderInstanceType, sliderNodeType }) =>
    isSliderEnabled({ deployment, sliderInstanceType, sliderNodeType }),
  )

  return enabledTypes
}
