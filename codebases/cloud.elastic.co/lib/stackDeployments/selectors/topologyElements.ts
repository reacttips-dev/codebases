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
import { get, flatMap } from 'lodash'

import { isEnabledConfiguration } from '../../deployments/conversion'

import { getSupportedSliderInstanceTypesWithoutEs } from '../../../lib/sliders/support'

import { getNodeRoles } from './nodeRoles'
import { getEsPlanFromGet } from './fundamentals'
import {
  DeploymentResources,
  ElasticsearchClusterTopologyElement,
  ElasticsearchNodeType,
  ApmPayload,
  ApmTopologyElement,
  DeploymentCreateRequest,
  DeploymentUpdateRequest,
  ElasticsearchPayload,
  KibanaClusterTopologyElement,
  KibanaPayload,
} from '../../api/v1/types'
import { AnyPayload, AnyTopologyElement, SliderInstanceType } from '../../../types'

export function getEsNodeConfigurationsFromGet({
  deployment,
  nodeType,
  onlySized = true,
}: {
  deployment: {
    resources: DeploymentResources
  }
  nodeType?: keyof ElasticsearchNodeType
  onlySized?: boolean
}): ElasticsearchClusterTopologyElement[] {
  const plan = getEsPlanFromGet({ deployment })

  if (!plan) {
    return []
  }

  const nodeConfigurations = plan.cluster_topology

  if (!Array.isArray(nodeConfigurations)) {
    return []
  }

  const matchingNodeConfigurations = nodeConfigurations.filter(matchesCriteria)

  return matchingNodeConfigurations

  function matchesCriteria(nodeConfiguration) {
    const matchesNodeType =
      nodeType === undefined ||
      hasNodeType({
        nodeConfiguration,
        nodeType,
      })

    if (!matchesNodeType) {
      return false
    }

    if (onlySized && !isEnabledConfiguration(nodeConfiguration)) {
      return false
    }

    return true
  }
}

function hasNodeType({
  nodeConfiguration,
  nodeType,
}: {
  nodeConfiguration: ElasticsearchClusterTopologyElement
  nodeType: keyof ElasticsearchNodeType
}): boolean {
  return getNodeRoles({ topologyElement: nodeConfiguration }).includes(nodeType)
}

export function getNodeTypes({
  nodeConfiguration,
}: {
  nodeConfiguration: ElasticsearchClusterTopologyElement
}) {
  return getNodeRoles({ topologyElement: nodeConfiguration })
}

export function getEsClusterConfigurationsFromDeploymentRequest({
  deployment,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}) {
  const esResources = deployment.resources?.elasticsearch

  if (!esResources) {
    return []
  }

  const [firstEs] = esResources
  const topologyPath = [`plan`, `cluster_topology`]
  const nodeConfigurations: ElasticsearchClusterTopologyElement[] = get(firstEs, topologyPath, [])

  return nodeConfigurations.filter((instance) =>
    hasNodeType({
      nodeConfiguration: instance,
      nodeType: 'data',
    }),
  )
}

export function getSliderClusterConfigurations({
  cluster,
  sliderInstanceType,
  nodeType,
  onlySized = true,
}: {
  cluster: AnyPayload
  sliderInstanceType: SliderInstanceType
  nodeType?: keyof ElasticsearchNodeType
  onlySized?: boolean
}) {
  const nodeConfigurations: AnyTopologyElement[] = []

  if (!Array.isArray(cluster.plan.cluster_topology)) {
    return nodeConfigurations
  }

  for (const nodeConfiguration of cluster.plan.cluster_topology) {
    if (sliderInstanceType === `elasticsearch`) {
      const nodeConfigurationAndType = { nodeConfiguration, nodeType } as {
        nodeConfiguration: ElasticsearchClusterTopologyElement
        nodeType: keyof ElasticsearchNodeType
      }

      if (nodeType !== undefined && !hasNodeType(nodeConfigurationAndType)) {
        continue
      }
    }

    if (onlySized && !isEnabledConfiguration(nodeConfiguration)) {
      continue
    }

    nodeConfigurations.push(nodeConfiguration)
  }

  return nodeConfigurations
}

export function getApmClusterConfigurations({
  cluster,
  onlySized = true,
}: {
  cluster: ApmPayload
  onlySized?: boolean
}) {
  return getSliderClusterConfigurations({
    cluster,
    onlySized,
    sliderInstanceType: `apm`,
  }) as ApmTopologyElement[]
}

export function getDeploymentNodeConfigurations({
  deployment,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}): AnyTopologyElement[] {
  return [
    ...getEsNodeConfigurations({ deployment }),
    ...flatMap(
      getSupportedSliderInstanceTypesWithoutEs().map((sliderInstanceType) =>
        getSliderNodeConfigurations({ deployment, sliderInstanceType }),
      ),
    ),
  ]
}

function getSliderNodeConfigurations({
  deployment,
  sliderInstanceType,
  nodeType,
  onlySized = true,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
  sliderInstanceType: SliderInstanceType
  nodeType?: keyof ElasticsearchNodeType
  onlySized?: boolean
}) {
  const nodeConfigurations: AnyTopologyElement[] = []

  if (deployment.resources![sliderInstanceType]) {
    for (const cluster of deployment.resources![sliderInstanceType]) {
      nodeConfigurations.push(
        ...getSliderClusterConfigurations({ cluster, sliderInstanceType, nodeType, onlySized }),
      )
    }
  }

  return nodeConfigurations
}

export function getEsNodeConfigurations({
  deployment,
  nodeType,
  onlySized,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
  nodeType?: keyof ElasticsearchNodeType
  onlySized?: boolean
}) {
  return getSliderNodeConfigurations({
    deployment,
    nodeType,
    onlySized,
    sliderInstanceType: `elasticsearch`,
  }) as ElasticsearchClusterTopologyElement[]
}

export function getEsClusterConfigurations({
  cluster,
  nodeType,
  onlySized = true,
}: {
  cluster: ElasticsearchPayload
  nodeType?: keyof ElasticsearchNodeType
  onlySized?: boolean
}) {
  return getSliderClusterConfigurations({
    cluster,
    nodeType,
    onlySized,
    sliderInstanceType: `elasticsearch`,
  }) as ElasticsearchClusterTopologyElement[]
}

export function getKibClusterConfigurations({
  cluster,
  onlySized = true,
}: {
  cluster: KibanaPayload
  onlySized?: boolean
}) {
  return getSliderClusterConfigurations({
    cluster,
    onlySized,
    sliderInstanceType: `kibana`,
  }) as KibanaClusterTopologyElement[]
}
