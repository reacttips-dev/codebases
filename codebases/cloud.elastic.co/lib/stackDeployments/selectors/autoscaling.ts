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

import { getConfigForKey } from '../../../store'

import { satisfies } from '../../semver'
import { getEsPlan } from './stackDeployment'
import { getEsPlanFromGet } from './fundamentals'
import { isDedicatedML, isData, isFrozen, supportsFrozenTierAutoscaling } from './nodeRoles'

import {
  DeploymentUpdateRequest,
  DeploymentCreateRequest,
  DeploymentTemplateInfoV2,
  ElasticsearchClusterTopologyElement,
} from '../../api/v1/types'
import { StackDeployment, AnyClusterPlanInfo, AnyTopologyElement } from '../../../types'

export function isAutoscalingAvailable(version: string): boolean {
  const minimumAutoscalingVersion = getConfigForKey('MINIMUM_AUTOSCALING_VERSION')

  return satisfies(version, `>=${minimumAutoscalingVersion}`)
}

export function canEnableAutoscaling({
  deploymentTemplate,
  version,
  inTrial,
}: {
  deploymentTemplate?: DeploymentTemplateInfoV2
  version: string
  inTrial: boolean
}): boolean {
  if (!deploymentTemplate) {
    // If the deployment template isn't loaded yet, we can't be sure
    return false
  }

  return (
    !inTrial &&
    isAutoscalingAvailable(version) &&
    isAutoscalingSupportedInTemplate({ deploymentTemplate })
  )
}

export function isAutoscaleableTier({
  topologyElement,
  version,
}: {
  topologyElement: AnyTopologyElement
  version?: string
}): boolean {
  if (isDedicatedML({ topologyElement })) {
    return true
  }

  if (!isData({ topologyElement })) {
    return false
  }

  if (isFrozen({ topologyElement })) {
    const esTopologyElement = topologyElement as ElasticsearchClusterTopologyElement

    if (esTopologyElement.autoscaling_max === undefined) {
      return false
    }

    return supportsFrozenTierAutoscaling({ version })
  }

  return true
}

export function isAutoscalingSupportedInTemplate({
  deploymentTemplate,
}: {
  deploymentTemplate: DeploymentTemplateInfoV2
}): boolean {
  const plan = getEsPlan({ deployment: deploymentTemplate.deployment_template })

  return typeof plan?.autoscaling_enabled === 'boolean'
}

export function isAutoscalingEnabledOnGet({
  deployment,
}: {
  deployment: StackDeployment
}): boolean {
  const plan = getEsPlanFromGet({ deployment })

  return Boolean(plan?.autoscaling_enabled)
}

export function isAutoscalingEnabled({
  deployment,
}: {
  deployment: DeploymentUpdateRequest | DeploymentCreateRequest
}): boolean {
  const plan = getEsPlan({ deployment })

  return Boolean(plan?.autoscaling_enabled)
}

export function getMaxedOutCapacityTopologyElements({
  deployment,
}: {
  deployment: StackDeployment
}): ElasticsearchClusterTopologyElement[] {
  const maxedOutCapacityTopologyElements: ElasticsearchClusterTopologyElement[] = []

  const plan = getEsPlanFromGet({ deployment })

  if (!plan || !plan.cluster_topology) {
    return maxedOutCapacityTopologyElements
  }

  plan.cluster_topology.forEach((topologyElement) => {
    if (!topologyElement.autoscaling_max || !topologyElement.size) {
      return
    }

    if (isDedicatedML({ topologyElement })) {
      if (topologyElement.autoscaling_max.value === topologyElement.autoscaling_min!.value) {
        return
      }
    }

    if (topologyElement.autoscaling_max.value === 0 && topologyElement.size.value === 0) {
      return
    }

    if (topologyElement.autoscaling_max.value <= topologyElement.size.value) {
      maxedOutCapacityTopologyElements.push(topologyElement)
    }
  })

  return maxedOutCapacityTopologyElements
}

export function displayAutoscalingLimitReached({
  size,
  autoscalingMax,
  autoscalingMin,
  isMachineLearning,
}: {
  size: number
  autoscalingMax: number
  autoscalingMin?: number
  isMachineLearning?: boolean
}): boolean {
  if (!isFinite(size)) {
    return false
  }

  if (isMachineLearning && autoscalingMax === autoscalingMin) {
    return false
  }

  if (autoscalingMax === 0 && size === 0) {
    return false
  }

  if (size >= autoscalingMax) {
    return true
  }

  return false
}

export function isAutoscalingGeneratedPlanAttempt({
  planAttempt,
}: {
  planAttempt: AnyClusterPlanInfo
}): boolean {
  return planAttempt.source?.facilitator === `autoscaling`
}

export function isAutoscalingTerminationPlanAttempt({
  planAttempt,
}: {
  planAttempt: AnyClusterPlanInfo
}): boolean {
  return planAttempt.source?.action === `terminate-deployment`
}
