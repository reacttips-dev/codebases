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

import { cloneDeep, set } from 'lodash'

import {
  isAutoscalingEnabled,
  isDedicatedML,
  isFrozen,
  getFirstEsCluster,
  supportsFrozenTierAutoscaling,
} from './selectors'

import {
  DeploymentUpdateRequest,
  DeploymentCreateRequest,
  ElasticsearchPayload,
  ElasticsearchClusterPlan,
  ElasticsearchClusterTopologyElement,
} from '../api/v1/types'

function removeAutoscalingFromTopology(topologyElement: ElasticsearchClusterTopologyElement) {
  delete topologyElement.autoscaling_min
  delete topologyElement.autoscaling_max
  delete topologyElement.autoscaling_policy_override_json
}

export function sanitizeForAutoscaling({
  deployment,
}: {
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
}): void {
  const { resources } = deployment

  if (!resources) {
    return
  }

  const esResource = getFirstEsCluster({ deployment })

  if (!esResource || !esResource.plan || !esResource.plan.cluster_topology) {
    return
  }

  const isAutoscaling = isAutoscalingEnabled({ deployment })

  if (!isAutoscaling) {
    // remove autoscaling data
    esResource.plan.cluster_topology.forEach(removeAutoscalingFromTopology)
  }

  if (isAutoscaling) {
    const ml = esResource.plan.cluster_topology.find((topologyElement) =>
      isDedicatedML({ topologyElement }),
    )

    if (ml) {
      delete ml.size
    }

    const esVersion = esResource.plan.elasticsearch.version

    if (esVersion && !supportsFrozenTierAutoscaling({ version: esVersion })) {
      esResource.plan.cluster_topology
        .filter((topologyElement) => isFrozen({ topologyElement }))
        .forEach(removeAutoscalingFromTopology)
    }
  }
}

export function setAutoscalingEnabled<T extends DeploymentUpdateRequest | DeploymentCreateRequest>({
  deployment,
  blankTemplate,
}: {
  deployment: T
  blankTemplate?: ElasticsearchClusterPlan | null
}): T {
  const newDeployment = cloneDeep(deployment)

  const { resources } = newDeployment

  const cluster = getFirstEsCluster({ deployment: newDeployment })

  set(cluster!, [`plan`, 'autoscaling_enabled'], true)

  if (!resources || !resources.elasticsearch) {
    return newDeployment
  }

  resources.elasticsearch?.forEach((resource) => addAutoscalingMinMax(resource, blankTemplate))

  return newDeployment
}

export function setAutoscalingDisabled<
  T extends DeploymentUpdateRequest | DeploymentCreateRequest,
>({ deployment }: { deployment: T }): T {
  const newDeployment = cloneDeep(deployment)

  const { resources } = newDeployment

  const cluster = getFirstEsCluster({ deployment: newDeployment })

  set(cluster!, [`plan`, 'autoscaling_enabled'], false)

  if (!resources || !resources.elasticsearch) {
    return newDeployment
  }

  resources.elasticsearch?.forEach((resource) => removeAutoscalingMinMax(resource))

  return newDeployment
}

function addAutoscalingMinMax(
  resource: ElasticsearchPayload,
  blankTemplate?: ElasticsearchClusterPlan | null,
): void {
  if (!resource.plan) {
    return
  }

  if (!Array.isArray(resource.plan.cluster_topology)) {
    return
  }

  resource.plan.cluster_topology.forEach((topologyElement) => {
    let templateTopologyItem

    if (blankTemplate?.cluster_topology) {
      templateTopologyItem = blankTemplate.cluster_topology.find(
        (topologyItem) => topologyItem.id === topologyElement.id,
      )
    }

    const minSize = templateTopologyItem?.autoscaling_min?.value
    const maxSize = templateTopologyItem?.autoscaling_max?.value

    if (typeof minSize === 'number') {
      topologyElement.autoscaling_min = { value: minSize, resource: 'memory' }
    }

    if (typeof maxSize === 'number') {
      topologyElement.autoscaling_max = { value: maxSize, resource: 'memory' }
    }
  })
}

function removeAutoscalingMinMax(resource: ElasticsearchPayload): void {
  if (!resource.plan) {
    return
  }

  if (!Array.isArray(resource.plan.cluster_topology)) {
    return
  }

  resource.plan.cluster_topology.forEach((nodeConfiguration) => {
    delete nodeConfiguration.autoscaling_min
    delete nodeConfiguration.autoscaling_max
  })
}
